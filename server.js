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

// Serve static files from the built client in production
app.use(express.static(path.join(__dirname, 'client', 'dist')));

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

async function getHistoryGeoJson(hoursAgo = 24) {
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

// Returns the exact nearest boundary point on the frontline polygons.
// We iterate raw coordinate rings directly because turf.polygonToLine() returns a
// FeatureCollection for multi-ring polygons, which nearestPointOnLine() cannot handle
// and would silently snap to an incorrect location (e.g., Japan).
function findNearestDistanceWithPoint(point, geoJson) {
    if (!geoJson || !geoJson.features) return { distance: null, nearest: null };

    let minDistance = Infinity;
    let nearestCoord = null;
    const userPoint = turf.point([point.lng, point.lat]);

    // Process one ring (array of [lng, lat] positions) — only the outer ring matters.
    function processRing(ring) {
        if (!ring || ring.length < 2) return;
        try {
            const line = turf.lineString(ring);
            const dist = turf.pointToLineDistance(userPoint, line, { units: 'kilometers' });
            if (dist < minDistance) {
                minDistance = dist;
                const snapped = turf.nearestPointOnLine(line, userPoint, { units: 'kilometers' });
                nearestCoord = snapped.geometry.coordinates;
            }
        } catch (_) { /* skip malformed ring */ }
    }

    geoJson.features.forEach(feature => {
        const isEnemy = feature.properties.fill === '#a52714' ||
            feature.properties.fill === '#ff5252' ||
            feature.properties.fill === '#bdbdbd';

        if (!feature.geometry || !isEnemy) return;

        // DeepState data uses the same colors for ALL Russian-controlled areas
        // (Kaliningrad, Crimea, occupied Donbas, etc). We ONLY want features
        // that are part of the active frontline in Ukraine.
        // Filter by centroid being within the Ukraine conflict bounding box.
        try {
            const c = turf.centroid(feature).geometry.coordinates;
            const cLng = c[0], cLat = c[1];
            const inUkraineBbox = cLat >= 44.0 && cLat <= 53.0 && cLng >= 22.0 && cLng <= 42.0;
            if (!inUkraineBbox) return;
        } catch (_) { return; }

        try {
            if (feature.geometry.type === 'Polygon') {
                // coordinates[0] is the outer ring
                processRing(feature.geometry.coordinates[0]);
            } else if (feature.geometry.type === 'MultiPolygon') {
                // Each item: [outerRing, ...holeRings]; we only need the outer ring
                for (const polygonCoords of feature.geometry.coordinates) {
                    processRing(polygonCoords[0]);
                }
            }
        } catch (e) {
            /* skip features with unexpected geometry */
        }
    });

    return {
        distance: minDistance === Infinity ? null : minDistance,
        nearest: nearestCoord ? { lng: nearestCoord[0], lat: nearestCoord[1] } : null,
    };
}

function findNearestDistance(point, geoJson) {
    return findNearestDistanceWithPoint(point, geoJson).distance;
}

// Determine which region the user is in
function classifyRegion(lat, lng) {
    // Russia (approximate bounding boxes for major Russian territories)
    // European Russia: lat 41-82, lng 28-60 (excluding Ukraine)
    // Asian Russia: lat 41-82, lng 60-190
    // Crimea (occupied): lat 44-46.2, lng 32.5-36.7
    // Kaliningrad: lat 54.3-55.3, lng 19.6-22.9

    const isCrimea = lat >= 44 && lat <= 46.2 && lng >= 32.5 && lng <= 36.7;

    // Ukraine mainland (without occupied territories — rough bounding box)
    const isUkraineBbox = lat >= 44.3 && lat <= 52.4 && lng >= 22 && lng <= 40.2;

    // Russia bounding boxes
    const isRussiaEurope = lat >= 41 && lat <= 82 && lng >= 37 && lng <= 60 && !isUkraineBbox;
    const isRussiaAsia = lat >= 41 && lat <= 82 && lng >= 60 && lng <= 190;
    const isKaliningrad = lat >= 54.3 && lat <= 55.3 && lng >= 19.6 && lng <= 22.9;
    const isMoscowArea = lat >= 54 && lat <= 57 && lng >= 35 && lng <= 40;
    const isStPetersburg = lat >= 59 && lat <= 61 && lng >= 29 && lng <= 31;

    // Belarus (occupied ally)
    const isBelarus = lat >= 51.2 && lat <= 56.2 && lng >= 23.2 && lng <= 32.8;

    if (isCrimea || isKaliningrad || isMoscowArea || isStPetersburg || isRussiaEurope || isRussiaAsia) {
        return 'russia';
    }

    if (isBelarus) {
        return 'belarus';
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
        getHistoryGeoJson(24)
    ]);

    const currentResult = findNearestDistanceWithPoint(userLatLng, latestGeoJson);
    const currentDistance = currentResult.distance;
    const nearestFrontlinePoint = currentResult.nearest;
    const historyDistance = findNearestDistance(userLatLng, historyGeoJson);

    let change = null;
    if (currentDistance !== null && historyDistance !== null) {
        change = historyDistance - currentDistance; // positive means enemy got closer
    }

    res.json({
        currentDistanceKm: currentDistance,
        nearestFrontlinePoint,
        change7dKm: change,
        change24hKm: change,
        region: region,
        timestamp: new Date().toISOString()
    });
});

// SPA catch-all: serve index.html for any non-API routes
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
