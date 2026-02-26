import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icons (inline SVG to avoid asset import issues)
const userIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#4ade80" stroke="#1a1a1a" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#1a1a1a"/></svg>`;
const frontIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#ff4444" stroke="#1a1a1a" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4" y1="4" x2="20" y2="20" stroke="#1a1a1a" stroke-width="2.5"/><line x1="20" y1="4" x2="4" y2="20" stroke="#1a1a1a" stroke-width="2.5"/></svg>`;

const makeIcon = (svg) => L.divIcon({
    html: svg,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
});

function FrontlineMap({ userLat, userLng, frontLat, frontLng, distanceKm }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map with dark CartoDB tiles
        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: false,
            dragging: true,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !userLat || !userLng) return;

        // Clear previous markers/layers
        map.eachLayer(layer => {
            if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
        });

        const userLatLng = [userLat, userLng];

        // User marker (green dot)
        L.marker(userLatLng, { icon: makeIcon(userIconSvg) })
            .addTo(map)
            .bindPopup('<b style="color:#4ade80">📍 Ваше місцезнаходження</b>')
            .openPopup();

        const bounds = [userLatLng];

        if (frontLat && frontLng) {
            const frontLatLng = [frontLat, frontLng];

            // Frontline marker (red X)
            L.marker(frontLatLng, { icon: makeIcon(frontIconSvg) })
                .addTo(map)
                .bindPopup(`<b style="color:#ff4444">🎯 Найближча точка фронту</b><br/><span style="color:#aaa; font-size:0.85em">${distanceKm ? Math.round(distanceKm) + ' км від вас' : ''}</span>`);

            // Dashed line between user and frontline
            L.polyline([userLatLng, frontLatLng], {
                color: '#ff4444',
                weight: 2,
                dashArray: '8 6',
                opacity: 0.8,
            }).addTo(map);

            // Midpoint label with distance
            if (distanceKm) {
                const midLat = (userLat + frontLat) / 2;
                const midLng = (userLng + frontLng) / 2;
                L.marker([midLat, midLng], {
                    icon: L.divIcon({
                        html: `<div style="background:rgba(0,0,0,0.75);color:#ff4444;font-size:11px;font-weight:700;padding:3px 8px;border-radius:8px;border:1px solid rgba(255,68,68,0.4);white-space:nowrap;font-family:monospace;">${Math.round(distanceKm)} км</div>`,
                        className: '',
                        iconAnchor: [30, 10],
                    })
                }).addTo(map);
            }

            bounds.push(frontLatLng);

            // Fit view to show both points
            map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
        } else {
            // No frontline point — zoom to user
            map.setView(userLatLng, 7);
        }
    }, [userLat, userLng, frontLat, frontLng, distanceKm]);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }} />
            {/* Attribution */}
            <div style={{
                position: 'absolute', bottom: 6, right: 8, fontSize: '9px',
                color: 'rgba(255,255,255,0.3)', zIndex: 1000, pointerEvents: 'none'
            }}>
                © CartoDB · DeepStateUA
            </div>
        </div>
    );
}

export default FrontlineMap;
