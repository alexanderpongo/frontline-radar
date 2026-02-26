import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Inject dark overrides for Leaflet controls (runs once)
const DARK_CSS = `
  .frontline-map .leaflet-control-zoom a {
    background: rgba(20,20,30,0.85) !important;
    color: rgba(255,255,255,0.6) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    backdrop-filter: blur(6px);
    transition: color 0.2s;
  }
  .frontline-map .leaflet-control-zoom a:hover {
    color: #fff !important;
    background: rgba(40,40,60,0.95) !important;
  }
  .frontline-map .leaflet-bar {
    border: none !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.5) !important;
  }
  .frontline-map .leaflet-popup-content-wrapper {
    background: rgba(15,15,25,0.95) !important;
    color: #fff !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6) !important;
    backdrop-filter: blur(10px);
  }
  .frontline-map .leaflet-popup-tip {
    background: rgba(15,15,25,0.95) !important;
  }
  .frontline-map .leaflet-popup-close-button {
    color: rgba(255,255,255,0.5) !important;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('frontline-map-css')) {
    const style = document.createElement('style');
    style.id = 'frontline-map-css';
    style.textContent = DARK_CSS;
    document.head.appendChild(style);
}

const userIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="rgba(74,222,128,0.15)" stroke="#4ade80" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="#4ade80"/></svg>`;
const frontIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="rgba(255,68,68,0.15)" stroke="#ff4444" stroke-width="1.5"/><line x1="7" y1="7" x2="17" y2="17" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round"/><line x1="17" y1="7" x2="7" y2="17" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round"/></svg>`;

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
        <div className="frontline-map" style={{ position: 'relative', height: '100%', width: '100%', borderRadius: 'inherit', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

            {/* Bottom gradient — matches old OSM embed style */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '45%',
                background: 'linear-gradient(to top, rgba(8,8,15,0.75) 0%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 500,
            }} />

            {/* Top-left vignette */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.3) 0%, transparent 65%)',
                pointerEvents: 'none',
                zIndex: 500,
            }} />
        </div>
    );
}

export default FrontlineMap;
