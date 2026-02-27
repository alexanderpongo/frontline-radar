import express from 'express';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as turf from '@turf/turf';

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/', limiter);
app.use(cors());
app.use(express.json());

let lastGeoJson = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function getLatestGeoJson() {
    const now = Date.now();
    if (lastGeoJson && (now - lastUpdate < CACHE_DURATION)) {
        return lastGeoJson;
    }

    try {
        const response = await axios.get('https://deepstatemap.live/api/history/last');
        lastGeoJson = response.data.map;
        lastUpdate = now;
        return lastGeoJson;
    } catch (error) {
        console.error('Error fetching DeepState data:', error);
        return lastGeoJson;
    }
}

async function getHistoryGeoJson(hoursAgo = 168) {
    try {
        const historyListResponse = await axios.get('https://deepstatemap.live/api/history/public');
        const historyList = historyListResponse.data;
        const targetTime = Date.now() - (hoursAgo * 60 * 60 * 1000);

        let closest = historyList[0];
        let minDiff = Math.abs(new Date(closest.createdAt).getTime() - targetTime);

        for (const entry of historyList) {
            const diff = Math.abs(new Date(entry.createdAt).getTime() - targetTime);
            if (diff < minDiff) {
                minDiff = diff;
                closest = entry;
            }
        }

        const geoJsonResponse = await axios.get(`https://deepstatemap.live/api/history/${closest.id}/geojson`);
        return geoJsonResponse.data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return null;
    }
}

// Improved Logic from server.js
function findNearestDistanceWithPoint(point, geoJson) {
    if (!geoJson || !geoJson.features) return { distance: null, nearest: null };

    let minDistance = Infinity;
    let nearestCoord = null;
    const userPoint = turf.point([point.lng, point.lat]);

    const FL_LAT_MIN = 44.0, FL_LAT_MAX = 51.5;
    const FL_LNG_MIN = 22.0, FL_LNG_MAX = 39.2;

    function processRingFrontlineOnly(ring) {
        if (!ring || ring.length < 2) return;
        for (let i = 0; i < ring.length - 1; i++) {
            const a = ring[i];
            const b = ring[i + 1];
            const midLng = (a[0] + b[0]) / 2;
            const midLat = (a[1] + b[1]) / 2;
            if (midLat < FL_LAT_MIN || midLat > FL_LAT_MAX || midLng < FL_LNG_MIN || midLng > FL_LNG_MAX) continue;
            try {
                const seg = turf.lineString([a, b]);
                const dist = turf.pointToLineDistance(userPoint, seg, { units: 'kilometers' });
                if (dist < minDistance) {
                    minDistance = dist;
                    const snapped = turf.nearestPointOnLine(seg, userPoint, { units: 'kilometers' });
                    nearestCoord = snapped.geometry.coordinates;
                }
            } catch (_) { }
        }
    }

    geoJson.features.forEach(feature => {
        const isEnemy = feature.properties.fill === '#ff5252' || feature.properties.fill === '#bdbdbd' || feature.properties.fill === '#bcaaa4';
        if (!feature.geometry || !isEnemy) return;

        try {
            const c = turf.centroid(feature).geometry.coordinates;
            const inUkraineBbox = c[1] >= 44.0 && c[1] <= 53.0 && c[0] >= 22.0 && c[0] <= 42.0;
            if (!inUkraineBbox) return;
        } catch (_) { return; }

        try {
            if (feature.geometry.type === 'Polygon') {
                for (const ring of feature.geometry.coordinates) processRingFrontlineOnly(ring);
            } else if (feature.geometry.type === 'MultiPolygon') {
                for (const polygonCoords of feature.geometry.coordinates) {
                    for (const ring of polygonCoords) processRingFrontlineOnly(ring);
                }
            }
        } catch (e) { }
    });

    return {
        distance: minDistance === Infinity ? null : minDistance,
        nearest: nearestCoord ? { lng: nearestCoord[0], lat: nearestCoord[1] } : null,
    };
}

function classifyRegion(lat, lng) {
    const isCrimea = lat >= 44 && lat <= 46.2 && lng >= 32.5 && lng <= 36.7;
    const isOccupiedDonbas = lat >= 47.0 && lat <= 49.5 && lng >= 37.0 && lng <= 40.5;
    const isOccupiedSouth = lat >= 46.0 && lat <= 48.0 && lng >= 33.0 && lng <= 37.5;
    const isUkraineBbox = lat >= 44.3 && lat <= 52.4 && lng >= 22 && lng <= 41.0;

    if (isCrimea || isOccupiedDonbas || isOccupiedSouth) return 'occupied_ukraine';

    const isRussiaEurope = lat >= 41 && lat <= 82 && lng >= 37 && lng <= 60 && !isUkraineBbox;
    const isRussiaAsia = lat >= 41 && lat <= 82 && lng >= 60 && lng <= 190;
    const isKaliningrad = lat >= 54.3 && lat <= 55.3 && lng >= 19.6 && lng <= 22.9;

    if (isRussiaEurope || isRussiaAsia || isKaliningrad) return 'russia';
    if (isUkraineBbox) return 'ukraine';
    return 'abroad';
}

app.get('/api/proximity', async (req, res) => {
    let { lat, lng } = req.query;
    lat = parseFloat(lat);
    lng = parseFloat(lng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'Valid latitude and longitude are required' });
    }

    const userLatLng = { lat, lng };
    const region = classifyRegion(lat, lng);

    const [latestGeoJson, historyGeoJson] = await Promise.all([
        getLatestGeoJson(),
        getHistoryGeoJson(168)
    ]);

    const currentResult = findNearestDistanceWithPoint(userLatLng, latestGeoJson);
    const historyResult = findNearestDistanceWithPoint(userLatLng, historyGeoJson);

    let change = null;
    if (currentResult.distance !== null && historyResult.distance !== null) {
        change = historyResult.distance - currentResult.distance;
    }

    res.json({
        currentDistanceKm: currentResult.distance,
        nearestFrontlinePoint: currentResult.nearest,
        change7dKm: change,
        region: region,
        timestamp: new Date().toISOString()
    });
});

export default app;


