import express from 'express';
import axios from 'axios';
import cors from 'cors';
import * as turf from '@turf/turf';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files logic removed as Vercel handles this via vercel.json

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
        return lastGeoJson; // Return cached even if expired
    }
}

async function getHistoryGeoJson(hoursAgo = 168) {
    try {
        const historyListResponse = await axios.get('https://deepstatemap.live/api/history/public');
        const historyList = historyListResponse.data;

        const targetTime = Date.now() - (hoursAgo * 60 * 60 * 1000);

        // Find the closest history entry to targetTime
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

function findNearestDistance(point, geoJson) {
    if (!geoJson || !geoJson.features) return { distance: null, nearestPoint: null };

    let minDistance = Infinity;
    let nearestCoord = null;
    const userPoint = turf.point([point.lng, point.lat]);

    geoJson.features.forEach(feature => {
        const fill = (feature.properties.fill || '').toLowerCase();

        // Only measure to genuinely Russian-occupied territory (#a52714)
        // Exclude: #ff5252 (Transnistria/Tskhinvali), #880e4f (border markers)
        // Include #bcaaa4 "unknown/contested" — these are DeepState's buffer zones
        // drawn directly on the active contact line (between occupied & free Ukraine).
        // They give the most accurate frontline distance.
        const isEnemy = fill === '#a52714' || fill === '#bcaaa4';

        if (feature.geometry && isEnemy) {
            try {
                let distance;
                let candidateNearest;

                if (feature.geometry.type === 'Polygon') {
                    const line = turf.polygonToLine(feature);
                    distance = turf.pointToLineDistance(userPoint, line);
                    candidateNearest = turf.nearestPointOnLine(line, userPoint);
                } else if (feature.geometry.type === 'MultiPolygon') {
                    let minPolyDist = Infinity;
                    feature.geometry.coordinates.forEach(coords => {
                        const poly = turf.polygon(coords);
                        const line = turf.polygonToLine(poly);
                        const dist = turf.pointToLineDistance(userPoint, line);
                        if (dist < minPolyDist) {
                            minPolyDist = dist;
                            candidateNearest = turf.nearestPointOnLine(line, userPoint);
                        }
                    });
                    distance = minPolyDist;
                } else {
                    distance = turf.distance(userPoint, turf.nearestPoint(userPoint, feature));
                    candidateNearest = turf.nearestPoint(userPoint, feature);
                }

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCoord = candidateNearest?.geometry?.coordinates;
                }
            } catch (e) {
                try {
                    const nearest = turf.nearestPoint(userPoint, feature);
                    const distance = turf.distance(userPoint, nearest);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestCoord = nearest?.geometry?.coordinates;
                    }
                } catch (e2) { }
            }
        }
    });

    return {
        distance: minDistance === Infinity ? null : minDistance,
        nearestPoint: nearestCoord ? { lat: nearestCoord[1], lng: nearestCoord[0] } : null
    };
}

// Determine which region the user is in
function classifyRegion(lat, lng) {
    // Crimea (occupied): lat 44-46.2, lng 32.5-36.7
    const isCrimea = lat >= 44 && lat <= 46.2 && lng >= 32.5 && lng <= 36.7;

    // Occupied Donbas & South (rough bboxes for Luhansk, Donetsk occupied, Zaporizhzhia occ, Kherson occ)
    const isOccupiedDonbas = lat >= 47.0 && lat <= 49.5 && lng >= 37.0 && lng <= 40.5;
    const isOccupiedSouth = lat >= 46.0 && lat <= 48.0 && lng >= 33.0 && lng <= 37.5;

    // Ukraine mainland bounding box (including occupied zones)
    const isUkraineBbox = lat >= 44.3 && lat <= 52.4 && lng >= 22 && lng <= 40.2;

    // Russia bounding boxes
    const isRussiaEurope = lat >= 41 && lat <= 82 && lng >= 37 && lng <= 60 && !isUkraineBbox;
    const isRussiaAsia = lat >= 41 && lat <= 82 && lng >= 60 && lng <= 190;
    const isKaliningrad = lat >= 54.3 && lat <= 55.3 && lng >= 19.6 && lng <= 22.9;

    // Occupied Ukrainian territory — shows Ukrainian message
    if (isCrimea || isOccupiedDonbas || isOccupiedSouth) {
        return 'occupied_ukraine';
    }

    if (isKaliningrad || isRussiaEurope || isRussiaAsia) {
        return 'russia';
    }

    if (isUkraineBbox) {
        return 'ukraine';
    }

    return 'abroad';
}

app.get('/api/proximity', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const userLatLng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const region = classifyRegion(userLatLng.lat, userLatLng.lng);

    const [latestGeoJson, historyGeoJson] = await Promise.all([
        getLatestGeoJson(),
        getHistoryGeoJson(168) // 7 days
    ]);

    const currentResult = findNearestDistance(userLatLng, latestGeoJson);
    const historyResult = findNearestDistance(userLatLng, historyGeoJson);

    const currentDistance = currentResult.distance;
    const nearestPoint = currentResult.nearestPoint;

    let change7d = null;
    if (currentDistance !== null && historyResult.distance !== null) {
        change7d = historyResult.distance - currentDistance; // positive means enemy got closer
    }

    res.json({
        currentDistanceKm: currentDistance,
        nearestFrontlinePoint: nearestPoint,
        change7dKm: change7d,
        region: region,
        timestamp: new Date().toISOString()
    });
});

export default app;

