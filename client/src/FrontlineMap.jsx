import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ––– Dark CSS overrides for Leaflet (injected once) –––
const DARK_CSS = `
  .frontline-map .leaflet-container {
    background: #060608 !important;
    outline: none !important;
    border: none !important;
  }
  .frontline-map .leaflet-control-zoom {
    border: none !important;
    margin: 14px !important;
  }
  .frontline-map .leaflet-control-zoom a {
    background: rgba(12,12,20,0.88) !important;
    color: rgba(255,255,255,0.5) !important;
    border: 1px solid rgba(255,255,255,0.07) !important;
    backdrop-filter: blur(8px) !important;
    width: 28px !important;
    height: 28px !important;
    line-height: 28px !important;
    font-size: 14px !important;
    transition: all 0.2s !important;
    display: block !important;
  }
  .frontline-map .leaflet-control-zoom a:first-child {
    border-radius: 8px 8px 0 0 !important;
    border-bottom: none !important;
  }
  .frontline-map .leaflet-control-zoom a:last-child {
    border-radius: 0 0 8px 8px !important;
  }
  .frontline-map .leaflet-control-zoom a:hover {
    color: #fff !important;
    background: rgba(255,50,50,0.15) !important;
    border-color: rgba(255,68,68,0.25) !important;
  }
  .frontline-map .leaflet-bar {
    box-shadow: 0 4px 20px rgba(0,0,0,0.7) !important;
  }
  .frontline-map .leaflet-popup-content-wrapper {
    background: rgba(8,8,16,0.97) !important;
    color: #fff !important;
    border: 1px solid rgba(255,68,68,0.2) !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 32px rgba(0,0,0,0.8), 0 0 20px rgba(255,68,68,0.1) !important;
    backdrop-filter: blur(16px) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px !important;
  }
  .frontline-map .leaflet-popup-tip-container {
    display: none !important;
  }
  .frontline-map .leaflet-popup-close-button {
    color: rgba(255,255,255,0.3) !important;
    font-size: 16px !important;
    right: 8px !important;
    top: 6px !important;
  }
  .frontline-map .leaflet-popup-close-button:hover {
    color: rgba(255,68,68,0.8) !important;
    background: none !important;
  }
  .frontline-map .leaflet-tile-pane {
    filter: brightness(0.72) contrast(1.05) saturate(0.7) !important;
  }
  .frontline-map .leaflet-control-container .leaflet-top {
    z-index: 600 !important;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('frontline-map-css')) {
  const style = document.createElement('style');
  style.id = 'frontline-map-css';
  style.textContent = DARK_CSS;
  document.head.appendChild(style);
}

// ––– SVG Marker Icons –––
const userIconSvg = `
  <div style="position:relative;width:32px;height:32px">
    <div style="position:absolute;inset:0;border-radius:50%;background:rgba(74,222,128,0.12);animation:frontPulse 2s ease-in-out infinite"></div>
    <div style="position:absolute;inset:6px;border-radius:50%;border:1.5px solid rgba(74,222,128,0.5)"></div>
    <div style="position:absolute;inset:11px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px rgba(74,222,128,0.8)"></div>
    <style>@keyframes frontPulse{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.6);opacity:0}}</style>
  </div>`;

const frontIconSvg = `
  <div style="position:relative;width:32px;height:32px">
    <div style="position:absolute;inset:0;border-radius:50%;background:rgba(255,50,50,0.1);animation:frontPulse2 1.8s ease-in-out infinite"></div>
    <div style="position:absolute;inset:4px;border-radius:50%;border:1.5px solid rgba(255,68,68,0.45)"></div>
    <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:8px;width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="3" stroke-linecap="round">
      <line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/>
    </svg>
    <style>@keyframes frontPulse2{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.5);opacity:0}}</style>
  </div>`;

const makeIcon = (svg, size = 32) => L.divIcon({
  html: svg,
  className: '',
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
  popupAnchor: [0, -(size / 2) - 4],
});

function FrontlineMap({ userLat, userLng, frontLat, frontLng, distanceKm, directionLabel }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

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
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLat || !userLng) return;

    map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    const userLatLng = [userLat, userLng];

    // User marker
    L.marker(userLatLng, { icon: makeIcon(userIconSvg) })
      .addTo(map)
      .bindPopup(`<span style="color:#4ade80;font-weight:700;letter-spacing:0.1em">◉ YOUR POSITION</span><br/><span style="color:rgba(255,255,255,0.4);font-size:10px">${userLat.toFixed(4)}°N ${userLng.toFixed(4)}°E</span>`);

    const bounds = [userLatLng];

    if (frontLat && frontLng) {
      const frontLatLng = [frontLat, frontLng];

      // Frontline marker
      L.marker(frontLatLng, { icon: makeIcon(frontIconSvg) })
        .addTo(map)
        .bindPopup(`<span style="color:#ff4444;font-weight:700;letter-spacing:0.1em">✕ FRONTLINE</span><br/><span style="color:rgba(255,255,255,0.4);font-size:10px">${distanceKm ? '~' + Math.round(distanceKm) + ' km away' : ''}</span>`);

      // Glow shadow line (wider, semi-transparent)
      L.polyline([userLatLng, frontLatLng], {
        color: 'rgba(255,68,68,0.15)',
        weight: 10,
        lineCap: 'round',
      }).addTo(map);

      // Primary dashed red line
      L.polyline([userLatLng, frontLatLng], {
        color: '#ff4444',
        weight: 1.5,
        dashArray: '10 8',
        opacity: 0.9,
      }).addTo(map);

      // Distance + Direction label at midpoint
      if (distanceKm) {
        const midLat = (userLat + frontLat) / 2;
        const midLng = (userLng + frontLng) / 2;

        const dirText = typeof directionLabel === 'object' ? directionLabel?.region : directionLabel;
        const labelText = dirText
          ? `${dirText} · ${Math.round(distanceKm)} км`
          : `${Math.round(distanceKm)} км`;

        L.marker([midLat, midLng], {
          icon: L.divIcon({
            html: `<div style="
              background: rgba(12,12,20,0.95);
              color: #ff4444;
              font-size: 11px;
              font-weight: 810;
              padding: 6px 14px;
              border-radius: 100px;
              border: 1px solid rgba(255,68,68,0.5);
              white-space: nowrap;
              font-family: 'JetBrains Mono', monospace;
              letter-spacing: 0.05em;
              box-shadow: 0 4px 24px rgba(0,0,0,0.8), 0 0 15px rgba(255,68,68,0.25);
              backdrop-filter: blur(8px);
              transform: translate(-50%, -50%);
              display: inline-block;
            ">${labelText}</div>`,
            className: '',
            iconSize: [0, 0],
          })
        }).addTo(map);
      }

      bounds.push(frontLatLng);
      // Only fitBounds if coordinates haven't been fit before or if they changed significantly
      const coordStr = `${userLat},${userLng},${frontLat},${frontLng}`;
      if (map._lastFitCoords !== coordStr) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
        map._lastFitCoords = coordStr;
      }
    } else {
      map.setView(userLatLng, 7);
    }
  }, [userLat, userLng, frontLat, frontLng, distanceKm, directionLabel]);

  return (
    <div className="frontline-map" style={{
      position: 'relative',
      height: '100%',
      width: '100%',
      borderRadius: 'inherit',
      overflow: 'hidden',
    }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {/* Bottom gradient matching old OSM style */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(3,3,5,0.8) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 500,
      }} />
      {/* Top gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '20%',
        background: 'linear-gradient(to bottom, rgba(3,3,5,0.4) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 500,
      }} />
    </div>
  );
}

export default FrontlineMap;
