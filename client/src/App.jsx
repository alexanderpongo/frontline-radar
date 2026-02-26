import React, { useState } from 'react';
import './index.css';

/* ––– Inline SVG Icons ––– */
const IconZap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconRefresh = ({ spinning }) => (
  <svg className={spinning ? 'spin' : ''} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
);
const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const IconTrendUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const IconTrendDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
);
const IconExternal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);
const IconSkull = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M8 20v2h8v-2" /><path d="M12.5 17l-.5-1-.5 1h1z" /><path d="M16 20a2 2 0 001.56-3.25 8 8 0 10-11.12 0A2 2 0 008 20" /></svg>
);
const IconCrosshair = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></svg>
);
const IconActivity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.06)' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);
const IconSkullBig = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: '220px', height: '220px' }}><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M8 20v2h8v-2" /><path d="M12.5 17l-.5-1-.5 1h1z" /><path d="M16 20a2 2 0 001.56-3.25 8 8 0 10-11.12 0A2 2 0 008 20" /></svg>
);
const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
);
const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const IconFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
);
const IconHeartBig = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: '220px', height: '220px' }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
);
const IconFlagBig = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: '220px', height: '220px' }}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
);

function App() {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TEST MODE: override region via URL param
  const getRegion = () => {
    const params = new URLSearchParams(window.location.search);
    const testRegion = params.get('testRegion');
    if (testRegion && ['russia', 'belarus', 'ukraine', 'abroad'].includes(testRegion)) {
      return testRegion;
    }
    return data?.region || 'abroad';
  };
  const region = getRegion();
  const isEnemy = region === 'russia' || region === 'belarus';
  const isAbroad = region === 'abroad';

  // In production, API is on the same domain. In dev, it's on localhost:3001
  const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';

  const fetchProximity = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/proximity?lat=${lat}&lng=${lng}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(isAbroad ? "Failed to fetch data from server." : "Не вдалося отримати дані від сервера.");
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  const handleGetLocation = () => {
    setError(null);
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchProximity(latitude, longitude);
        },
        () => {
          setError(isAbroad ? "Location access denied." : "Доступ до геопозиції відхилено.");
          setLoading(false);
        }
      );
    } else {
      setError(isAbroad ? "Geolocation not supported." : "Геолокація не підтримується.");
      setLoading(false);
    }
  };

  // Status labels — localized
  const getStatus = (dist) => {
    if (isAbroad) {
      if (!dist && dist !== 0) return { cls: 'safe', label: 'Waiting...', msg: 'System ready to scan.' };
      if (dist < 20) return { cls: 'critical', label: 'Critical Zone', msg: 'Immediate proximity to enemy positions!' };
      if (dist < 60) return { cls: 'danger', label: 'High Danger', msg: 'Within long-range artillery strike zone.' };
      if (dist < 180) return { cls: 'warning', label: 'Watch Zone', msg: 'Enemy within monitored range. Stay alert.' };
      return { cls: 'safe', label: 'Stable Zone', msg: 'No direct collision threat at this time.' };
    }
    if (!dist && dist !== 0) return { cls: 'safe', label: 'Очікування...', msg: 'Система готова до сканування.' };
    if (dist < 20) return { cls: 'critical', label: 'Критична зона', msg: 'Ви знаходитесь у безпосередній близькості до ворожих позицій!' };
    if (dist < 60) return { cls: 'danger', label: 'Висока небезпека', msg: 'Зона враження далекобійної артилерії.' };
    if (dist < 180) return { cls: 'warning', label: 'Зона спостереження', msg: 'Ворог на контрольованій відстані. Слідкуйте за ситуацією.' };
    return { cls: 'safe', label: 'Стабільна зона', msg: 'Пряма загроза зіткнення на даний момент відсутня.' };
  };

  const status = getStatus(data?.currentDistanceKm);

  const getDynamicsDisplay = () => {
    if (!data) return { text: '—', cls: 'muted' };
    const c = data.change24hKm;
    if (c > 0.1) return { text: `+${c.toFixed(1)}`, cls: 'red' };
    if (c < -0.1) return { text: `−${Math.abs(c).toFixed(1)}`, cls: 'green' };
    return { text: '0.0', cls: 'muted' };
  };
  const dynamics = getDynamicsDisplay();

  // ––– War Crimes Card ––– 
  const renderWarCrimesCard = () => {
    const texts = {
      russia: { title: 'Цена километров', body: 'Каждый метр освобождённой земли пропитан доказательствами преступлений, которые не имеют срока давности. Мир должен видеть правду.', btn: 'Доказательства военных преступлений' },
      abroad: { title: 'The Price of Every Kilometer', body: 'Every meter of liberated land is soaked with evidence of crimes that have no statute of limitations. The world must see the truth.', btn: 'Evidence of War Crimes' },
      ukraine: { title: 'Ціна кілометрів', body: 'Кожен метр звільненої землі та кожен кілометр відстані просякнутий доказами злочинів, які не мають терміну давності. Світ повинен бачити правду.', btn: 'Докази воєнних злочинів' },
    };
    const t = texts[isEnemy ? 'russia' : region] || texts.ukraine;
    return (
      <div className="context-card warcrimes-card">
        <div className="context-bg-icon"><IconSkullBig /></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="context-card-header">
            <div className="context-icon warcrimes"><IconSkull /></div>
            <h4 className="context-title warcrimes">{t.title}</h4>
          </div>
          <p className="context-text warcrimes">{t.body}</p>
        </div>
        <a href="https://www.russianwarcrimeshouse.org/" target="_blank" rel="noreferrer" className="context-btn warcrimes" style={{ position: 'relative', zIndex: 2 }}>
          {t.btn}
          <IconExternal />
        </a>
      </div>
    );
  };

  // ––– Render: Enemy Territory (Russia/Belarus) –––
  const renderEnemyDashboard = () => (
    <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>
      {/* Enemy Territory Banner */}
      <div className="context-card russia-card" style={{ textAlign: 'center', padding: '4rem 3rem' }}>
        <div className="context-bg-icon"><IconFlagBig /></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="context-icon russia" style={{ margin: '0 auto 1.5rem', width: 64, height: 64 }}>
            <IconFlag />
          </div>
          <h2 className="context-title russia" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Вы на территории врага</h2>
          <p className="context-text russia" style={{ maxWidth: 480, margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Но вы можете быть полезны. Чат-бот <strong>«єВорог»</strong> (@evorog_bot) — официальный инструмент Минцифры Украины для передачи данных о расположении российских оккупантов, техники или РЛС. Передавайте фото/видео, точную геолокацию и описание, чтобы помочь уничтожить врага.
          </p>
          <a href="https://t.me/evorog_bot" target="_blank" rel="noreferrer" className="context-btn russia" style={{ maxWidth: 400, margin: '0 auto' }}>
            <IconSend />
            Открыть @evorog_bot в Telegram
          </a>
        </div>
      </div>

      {/* War Crimes */}
      {renderWarCrimesCard()}
    </div>
  );

  // ––– Render: Normal Dashboard (Ukraine & Abroad) –––
  const renderNormalDashboard = () => (
    <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>

      {/* Abroad: Support Ukraine banner at top */}
      {isAbroad && (
        <div className="context-card donate-card">
          <div className="context-bg-icon"><IconHeartBig /></div>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="context-card-header" style={{ marginBottom: '0.75rem' }}>
                <div className="context-icon donate"><IconHeart /></div>
                <h4 className="context-title donate">Support Ukraine</h4>
              </div>
              <p className="context-text donate" style={{ marginBottom: 0 }}>
                You are far from the front line, but your support can bring victory closer. Every donation goes directly to defense and rebuilding.
              </p>
            </div>
            <a href="https://u24.gov.ua/" target="_blank" rel="noreferrer" className="context-btn donate" style={{ margin: 0, width: 'auto', padding: '1rem 2.5rem', whiteSpace: 'nowrap' }}>
              <IconHeart />
              Donate via United24
            </a>
          </div>
        </div>
      )}

      {/* Main Readout */}
      <div className={`glass-card readout-card ${status.cls}`}>
        <div className="scan-line" />
        <div className="readout-inner">
          <div className="readout-top">
            <div className="readout-main">
              <div className="readout-sys-label">
                <span className={`pulse-dot ${loading ? 'yellow' : 'green'}`} />
                System.Status_Live
              </div>
              <div className={`status-label ${status.cls}`}>
                {status.label}
              </div>
              <div className="distance-display">
                <span className={`distance-number ${status.cls}`}>
                  {data ? Math.round(data.currentDistanceKm) : '—'}
                </span>
                <span className="distance-unit">km</span>
              </div>
              <p className="status-message">{status.msg}</p>
            </div>

            <div className="metrics-panel">
              {/* Dynamics */}
              <div className="metric-card">
                <div className="metric-label">
                  <span>{isAbroad ? '24h Shift' : 'Добове зміщення'}</span>
                  {dynamics.cls === 'red' ? <IconTrendUp /> : dynamics.cls === 'green' ? <IconTrendDown /> : <IconTrendUp />}
                </div>
                <div className={`metric-value ${dynamics.cls}`}>
                  {dynamics.text} <span style={{ fontSize: '0.7em', opacity: 0.5 }}>{isAbroad ? 'km' : 'км'}</span>
                </div>
              </div>

              {/* Source — compact inline */}
              <a href="https://deepstatemap.live" target="_blank" rel="noreferrer" className="source-link">
                <span className="source-dot" />
                <span className="source-name">DeepStateMap</span>
                <IconExternal />
              </a>

              {/* Sync */}
              <button className="sync-btn" onClick={handleGetLocation}>
                <IconRefresh spinning={loading} />
                {loading ? (isAbroad ? 'Updating...' : 'Оновлення...') : (isAbroad ? 'Rescan' : 'Синхронізація')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Map + War Crimes */}
      <div className="bottom-grid">
        <div className="map-container">
          <iframe
            className="map-frame"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Location Map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.15}%2C${location.lat - 0.15}%2C${location.lng + 0.15}%2C${location.lat + 0.15}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
          />
          <div className="map-gradient" />
          <div className="map-tag">
            <div className="ping" />
            <span>Pos {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
          </div>
        </div>
        {renderWarCrimesCard()}
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <div className="bg-grid" />
      <div className={`bg-aura ${isEnemy ? 'danger' : status.cls}`} />
      <div className="bg-noise" />

      <div className="app-container">

        {/* Header */}
        <header className="header animate-in">
          <div className="header-badge">
            <IconCrosshair />
            <span>Sentry System v2.1</span>
          </div>
          <h1>Frontline<br />Radar</h1>
          <p className="header-subtitle">
            {isAbroad
              ? 'Automated proximity analysis to the collision lines based on DeepStateUA intelligence data.'
              : 'Автоматизований аналіз близькості до ліній зіткнення за даними розвідки DeepStateUA.'}
          </p>
        </header>

        {/* Content */}
        {!location ? (
          <div className="glass-card animate-in" style={{ animationDelay: '0.15s' }}>
            <div className="scan-line" />
            <div className="landing">
              <div className="landing-visual">
                <div className="landing-glow" />
                <div className="landing-ring">
                  <div className="crosshair-v" />
                  <div className="crosshair-h" />
                  <IconActivity />
                </div>
              </div>

              <h2>{isAbroad ? 'System Ready' : 'Система готова'}</h2>
              <p>{isAbroad
                ? 'Allow location access to instantly calculate your distance to the front line.'
                : 'Надайте доступ до геопозиції для миттєвого розрахунку відстані до лінії фронту.'}</p>

              <div className="cta-wrap">
                <div className="cta-glow" />
                <button className="cta-btn" onClick={handleGetLocation} disabled={loading}>
                  {loading ? <IconRefresh spinning /> : <IconZap />}
                  {loading
                    ? (isAbroad ? 'Scanning...' : 'Зчитування...')
                    : (isAbroad ? 'Initiate Scan' : 'Ініціювати сканування')}
                </button>
              </div>

              {error && (
                <div className="error-text animate-fade">
                  <IconAlert /> {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          isEnemy ? renderEnemyDashboard() : renderNormalDashboard()
        )}

        {/* Footer */}
        <footer className="footer">
          <div className="footer-divider">
            <div className="line" />
            <span>Слава Україні</span>
            <div className="line" />
          </div>
          <div className="footer-meta">
            <div className="footer-meta-item">
              <span className="label">Source</span>
              <span className="value">DeepStateUA</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Engine</span>
              <span className="value">Turf.js</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Updated</span>
              <span className="value">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Status</span>
              <span className="value operational">Operational</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
