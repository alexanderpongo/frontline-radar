import express from 'express';
import axios from 'axios';
import cors from 'cors';
import * as turf from '@turf/turf';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Security Headers
app.use(helmet());

// Rate Limiting
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

// Returns the exact nearest boundary point on the active frontline (contact line).
//
// KEY INSIGHT: Occupied territory polygons from DeepState have their OUTER ring
// tracing the full perimeter — including the Russia/Belarus STATE BORDER on the east,
// which is NOT the frontline. The actual contact line between free and occupied Ukraine
// lies INSIDE Ukraine's geographic bounds.
//
// FIX: Instead of snapping to the full outer ring, we process each edge SEGMENT
// individually and only consider segments whose midpoint falls INSIDE Ukraine
// (roughly lng 22–40, lat 44–53 and NOT along the known Russia state border east edge).
// This discards border-with-Russia segments and keeps only the active frontline segments.
function findNearestDistanceWithPoint(point, geoJson) {
    if (!geoJson || !geoJson.features) return { distance: null, nearest: null };

    let minDistance = Infinity;
    let nearestCoord = null;
    const userPoint = turf.point([point.lng, point.lat]);

    // Ukraine conflict interior bounding box — segments must have their midpoint here
    // to be considered part of the active frontline (not the Russia/Belarus state border).
    const FL_LAT_MIN = 44.0, FL_LAT_MAX = 51.5; // 51.5 excludes Belarus-Ukraine border
    const FL_LNG_MIN = 22.0, FL_LNG_MAX = 39.2; // <39.2 excludes stale eastern borders

    function processRingFrontlineOnly(ring) {
        if (!ring || ring.length < 2) return;
        for (let i = 0; i < ring.length - 1; i++) {
            const a = ring[i];      // [lng, lat]
            const b = ring[i + 1]; // [lng, lat]
            // Midpoint of this edge segment
            const midLng = (a[0] + b[0]) / 2;
            const midLat = (a[1] + b[1]) / 2;
            // Only edges whose midpoint is inside Ukraine's active-frontline bbox
            if (
                midLat < FL_LAT_MIN || midLat > FL_LAT_MAX ||
                midLng < FL_LNG_MIN || midLng > FL_LNG_MAX
            ) continue;
            try {
                const seg = turf.lineString([a, b]);
                const dist = turf.pointToLineDistance(userPoint, seg, { units: 'kilometers' });
                if (dist < minDistance) {
                    minDistance = dist;
                    const snapped = turf.nearestPointOnLine(seg, userPoint, { units: 'kilometers' });
                    nearestCoord = snapped.geometry.coordinates;
                }
            } catch (_) { /* skip malformed segment */ }
        }
    }

    geoJson.features.forEach(feature => {
        // Red (#ff5252), Gray Zone (#bdbdbd), and Unknown Status (#bcaaa4)
        // We EXCLUDE #a52714 (Old occupied since 2014) because its boundaries
        // often represent old 2014 contact lines (like Stanytsia Luhanska)
        // that are no longer active frontlines.
        const isEnemy = feature.properties.fill === '#ff5252' ||
            feature.properties.fill === '#bdbdbd' ||
            feature.properties.fill === '#bcaaa4';

        if (!feature.geometry || !isEnemy) return;

        // Only process features whose centroid is in the Ukraine conflict zone.
        // This filters out Kaliningrad, Abkhazia, etc.
        try {
            const c = turf.centroid(feature).geometry.coordinates;
            const cLng = c[0], cLat = c[1];
            const inUkraineBbox = cLat >= 44.0 && cLat <= 53.0 && cLng >= 22.0 && cLng <= 42.0;
            if (!inUkraineBbox) return;
        } catch (_) { return; }

        try {
            if (feature.geometry.type === 'Polygon') {
                // Process ALL rings (outer boundary + any holes) — the frontline
                // contact line is encoded in the outer ring but we filter by bbox.
                for (const ring of feature.geometry.coordinates) {
                    processRingFrontlineOnly(ring);
                }
            } else if (feature.geometry.type === 'MultiPolygon') {
                for (const polygonCoords of feature.geometry.coordinates) {
                    for (const ring of polygonCoords) {
                        processRingFrontlineOnly(ring);
                    }
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

    if (isCrimea || isKaliningrad || isMoscowArea || isStPetersburg || isRussiaEurope || isRussiaAsia) {
        return 'russia';
    }

    if (isUkraineBbox) {
        return 'ukraine';
    }

    // Everything else (including Belarus, Moldova, EU countries) = abroad
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
