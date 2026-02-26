const express = require('express');
const axios = require('axios');
const cors = require('cors');
const turf = require('@turf/turf');
const path = require('path');

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

function findNearestDistance(point, geoJson) {
    if (!geoJson || !geoJson.features) return null;

    let minDistance = Infinity;
    const userPoint = turf.point([point.lng, point.lat]);

    geoJson.features.forEach(feature => {
        // DeepState colors:
        // #a52714: Occupied
        // #ff5252: Occupied/Breakthrough
        // #bdbdbd: Frontline/Grey zone
        const isEnemy = feature.properties.fill === '#a52714' ||
            feature.properties.fill === '#ff5252' ||
            feature.properties.fill === '#bdbdbd';

        if (feature.geometry && isEnemy) {
            try {
                let distance;
                if (feature.geometry.type === 'Polygon') {
                    distance = turf.pointToLineDistance(userPoint, turf.polygonToLine(feature));
                } else if (feature.geometry.type === 'MultiPolygon') {
                    // For MultiPolygon, find min distance to any constituent polygon
                    let minPolyDist = Infinity;
                    feature.geometry.coordinates.forEach(coords => {
                        const poly = turf.polygon(coords);
                        const dist = turf.pointToLineDistance(userPoint, turf.polygonToLine(poly));
                        if (dist < minPolyDist) minPolyDist = dist;
                    });
                    distance = minPolyDist;
                } else {
                    // Fallback to nearest point
                    distance = turf.distance(userPoint, turf.nearestPoint(userPoint, feature));
                }

                if (distance < minDistance) {
                    minDistance = distance;
                }
            } catch (e) {
                // If turf fails (e.g. invalid geometry), fallback to centroid or closest point
                try {
                    const distance = turf.distance(userPoint, turf.nearestPoint(userPoint, feature));
                    if (distance < minDistance) {
                        minDistance = distance;
                    }
                } catch (e2) { }
            }
        }
    });

    return minDistance === Infinity ? null : minDistance;
}

// Determine which region the user is in
function classifyRegion(lat, lng) {
    // Russia (approximate bounding boxes for major Russian territories)
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

    const currentDistance = findNearestDistance(userLatLng, latestGeoJson);
    const historyDistance = findNearestDistance(userLatLng, historyGeoJson);

    let change = null;
    if (currentDistance !== null && historyDistance !== null) {
        change = historyDistance - currentDistance; // positive means enemy got closer
    }

    res.json({
        currentDistanceKm: currentDistance,
        change24hKm: change,
        region: region,
        timestamp: new Date().toISOString()
    });
});

module.exports = app;

