import React, { useState } from 'react';
import './index.css';
import FrontlineMap from './FrontlineMap.jsx';

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
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconShieldBig = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: '220px', height: '220px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconHomeBig = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: '220px', height: '220px' }}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

// ––– Threat grades for Ukraine –––
function getUkraineThreatGrade(dist) {
  if (!dist && dist !== 0) return { cls: 'safe', label: 'Очікування...', msg: 'Система готова до сканування.' };
  if (dist < 30) return {
    cls: 'critical',
    label: '🚨 ТЕРМІНОВА ЕВАКУАЦІЯ',
    msg: 'Ви знаходитесь у зоні активних бойових дій. Негайно дотримуйтесь офіційних оголошень про евакуацію. Перебувайте в укритті!',
    advice: 'Відстань до окупованих позицій менша за 30 км — зона прямого ризику.'
  };
  if (dist < 100) return {
    cls: 'danger',
    label: '⚠️ ВИСОКА НЕБЕЗПЕКА',
    msg: 'Ви знаходитесь у зоні потенційного артилерійського обстрілу. Рекомендуємо серйозно розглянути евакуацію та підготувати тривожну валізу.',
    advice: 'Відстань до окупованих позицій менша за 100 км — зона дальнобійної артилерії.'
  };
  if (dist < 200) return {
    cls: 'warning',
    label: '🟡 ЗОНА ПІДВИЩЕНОЇ УВАГИ',
    msg: 'Ваш район у зоні моніторингу. Слідкуйте за офіційними каналами, знайте місце найближчого укриття та тримайте тривожну валізу напоготові.',
    advice: 'Відстань до окупованих позицій менша за 200 км — зона контролю.'
  };
  if (dist < 400) return {
    cls: 'warning',
    label: '🟠 ПОТЕНЦІЙНА ЗАГРОЗА',
    msg: 'Ви відносно далеко від лінії фронту, але ракетні удари можуть досягати вашого регіону. Знайте найближче укриття.',
    advice: 'Відстань до окупованих позицій менша за 400 км.'
  };
  if (dist < 700) return {
    cls: 'safe',
    label: '🟢 СТАБІЛЬНА ЗОНА',
    msg: 'Прямої загрози бойових дій зараз немає. Продовжуйте стежити за ситуацією.',
    advice: 'Відстань до окупованих позицій понад 400 км.'
  };
  return {
    cls: 'safe',
    label: '🟢 СТАБІЛЬНА ЗОНА',
    msg: 'Безпечна відстань від лінії фронту.',
    advice: `~${Math.round(dist)} км від окупованих позицій.`
  };
}

// ––– Compass bearing: user → nearest frontline point –––
function getDirection(userLat, userLng, frontLat, frontLng) {
  if (!frontLat || !frontLng) return null;

  // Compute bearing
  const φ1 = userLat * Math.PI / 180;
  const φ2 = frontLat * Math.PI / 180;
  const Δλ = (frontLng - userLng) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180 / Math.PI) + 360) % 360;

  // Compass label (Ukrainian)
  const dirs = [
    { max: 22.5, ua: 'Північ', en: 'N', symbol: '↑' },
    { max: 67.5, ua: 'Сх.-Пн.', en: 'NE', symbol: '↗' },
    { max: 112.5, ua: 'Схід', en: 'E', symbol: '→' },
    { max: 157.5, ua: 'Сх.-Пд.', en: 'SE', symbol: '↘' },
    { max: 202.5, ua: 'Південь', en: 'S', symbol: '↓' },
    { max: 247.5, ua: 'Зх.-Пд.', en: 'SW', symbol: '↙' },
    { max: 292.5, ua: 'Захід', en: 'W', symbol: '←' },
    { max: 337.5, ua: 'Зх.-Пн.', en: 'NW', symbol: '↖' },
    { max: 360, ua: 'Північ', en: 'N', symbol: '↑' },
  ];
  const dir = dirs.find(d => bearing < d.max);

  // Named region hint based on frontline coordinates
  let region = '—';
  const fLat = frontLat, fLng = frontLng;
  if (fLat > 50.0 && fLng < 37) region = 'Харківський напрям';
  else if (fLat > 49.5 && fLng >= 37) region = 'Луганський напрям';
  else if (fLat >= 48.5 && fLng >= 37) region = 'Донецький напрям';
  else if (fLat >= 47.5 && fLng >= 36) region = 'Донецький напрям';
  else if (fLat >= 47.0 && fLng >= 34 && fLng < 36.5) region = 'Запорізький напрям';
  else if (fLat >= 46.0 && fLng >= 32 && fLng < 34.5) region = 'Херсонський напрям';
  else if (fLat < 46.5 && fLng >= 33) region = 'Херсонський напрям';
  else region = dir?.ua + ' напрям';

  return { bearing: Math.round(bearing), symbol: dir?.symbol, en: dir?.en, region };
}

function App() {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TEST MODE: override region via URL param
  const getRegion = () => {
    const params = new URLSearchParams(window.location.search);
    const testRegion = params.get('testRegion');
    if (testRegion && ['russia', 'occupied_ukraine', 'ukraine', 'abroad', 'europe'].includes(testRegion)) {
      return testRegion;
    }
    return data?.region || 'ukraine'; // Default to ukraine for initial rendering
  };
  const region = getRegion();
  const isEnemy = region === 'russia';
  const isOccupied = region === 'occupied_ukraine';
  const isAbroad = region === 'abroad';
  const isUkraine = region === 'ukraine';

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

  // ––– Status for abroad (European) users –––
  const getAbroadStatus = (dist) => {
    if (!dist && dist !== 0) return { cls: 'safe', label: 'Waiting...', msg: 'System ready to scan.' };
    if (dist < 200) return { cls: 'critical', label: 'Critical Proximity', msg: 'The front line is extremely close. Immediate attention required.' };
    if (dist < 500) return { cls: 'danger', label: 'High Alert', msg: 'You are within range of the active conflict zone.' };
    if (dist < 1200) return { cls: 'warning', label: 'Watch Zone', msg: 'Ukraine stands between you and the threat. Stay informed.' };
    return { cls: 'safe', label: 'Monitored', msg: 'The distance is significant, but the conflict is ongoing.' };
  };

  const status = isAbroad
    ? getAbroadStatus(data?.currentDistanceKm)
    : getUkraineThreatGrade(data?.currentDistanceKm);

  const getDynamicsDisplay = () => {
    if (!data) return { text: '—', cls: 'muted' };
    const c = data.change7dKm;
    if (c === undefined || c === null) return { text: '—', cls: 'muted' };
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
    const t = texts[isEnemy ? 'russia' : isAbroad ? 'abroad' : 'ukraine'];
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

  // ––– Render: Russia –––
  const renderEnemyDashboard = () => (
    <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>
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
      {renderWarCrimesCard()}
    </div>
  );

  // ––– Render: Occupied Ukrainian territory (Crimea, Donbas, etc.) –––
  const renderOccupiedDashboard = () => (
    <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>
      {/* You are Ukraine message */}
      <div className="context-card" style={{ textAlign: 'center', padding: '4rem 3rem', background: 'linear-gradient(135deg, rgba(0,87,183,0.25) 0%, rgba(255,215,0,0.15) 100%)', borderColor: 'rgba(255,215,0,0.3)' }}>
        <div className="context-bg-icon"><IconHomeBig /></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇺🇦</div>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '1rem', color: '#FFD700', fontWeight: 800 }}>
            Ви — частина України
          </h2>
          <p style={{ maxWidth: 520, margin: '0 auto 1.5rem', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
            Тимчасова окупація не змінює правду: ця земля — українська. Крим, Донбас, Херсонщина, Запоріжжя — кожне місто і кожне село повернеться додому. <strong>Ви не самотні.</strong>
          </p>
          <p style={{ maxWidth: 480, margin: '0 auto 2rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Якщо ви бачите рух техніки, розташування окупантів або будь-яку корисну інформацію — передайте її через офіційний бот Міністерства цифрової трансформації України:
          </p>
          <a
            href="https://t.me/evorog_bot"
            target="_blank"
            rel="noreferrer"
            className="context-btn donate"
            style={{ maxWidth: 420, margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #0057b7 0%, #005bac 100%)', borderColor: 'rgba(0,87,183,0.5)' }}
          >
            <IconSend />
            Відкрити @evorog_bot в Telegram
          </a>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,215,0,0.7)', marginTop: '1rem' }}>
            Слава Україні! 🇺🇦 Ми повернемось.
          </p>
        </div>
      </div>
      {renderWarCrimesCard()}
    </div>
  );

  // ––– Render: Europe / Abroad –––
  const renderAbroadDashboard = () => (
    <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>

      {/* Shield message */}
      <div className="context-card donate-card" style={{ background: 'linear-gradient(135deg, rgba(30,80,160,0.3) 0%, rgba(10,40,100,0.2) 100%)', borderColor: 'rgba(100,160,255,0.25)' }}>
        <div className="context-bg-icon"><IconShieldBig /></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="context-card-header" style={{ marginBottom: '1rem' }}>
            <div className="context-icon donate"><IconShield /></div>
            <h4 className="context-title donate">Ukraine Is Europe's Shield</h4>
          </div>
          <p className="context-text donate" style={{ marginBottom: '1.2rem', lineHeight: 1.75 }}>
            For {data ? Math.round(data.currentDistanceKm) : '—'} km, Ukraine stands between you and the largest land war in Europe since 1945.
            Ukrainian soldiers are holding a line that protects the entire continent's security and the principles of sovereignty that every democratic nation relies on.
          </p>
          <p className="context-text donate" style={{ color: 'rgba(180,210,255,0.8)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            If Ukraine were to lose ground further westward, the current front line would shift closer to your home. Every city that Ukraine defends is a city in Europe that does not have to prepare for war. The most meaningful thing you can do right now is support Ukraine's resilience.
          </p>
        </div>
      </div>

      {/* Main Readout */}
      <div className={`glass-card readout-card ${status.cls}`}>
        <div className="scan-line" />
        <div className="readout-inner">
          <div className="readout-top">
            <div className="readout-main">
              <div className="readout-sys-label">
                <span className={`pulse-dot ${loading ? 'yellow' : 'green'}`} />
                Distance to Occupied Positions
              </div>
              <div className={`status-label ${status.cls}`}>{status.label}</div>
              <div className="distance-display">
                <span className={`distance-number ${status.cls}`}>
                  {data ? Math.round(data.currentDistanceKm) : '—'}
                </span>
                <span className="distance-unit">km</span>
              </div>
              {/* Direction row */}
              {data?.nearestFrontlinePoint && location && (() => {
                const dir = getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng);
                return dir ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px' }}>
                    <span style={{ color: 'rgba(255,68,68,0.7)', fontSize: 16 }}>{dir.symbol}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{dir.region}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{dir.bearing}°</span>
                  </div>
                ) : null;
              })()}
              <p className="status-message">{status.msg}</p>
            </div>
            <div className="metrics-panel">
              <div className="metric-card">
                <div className="metric-label">
                  <span>7-day Front Shift</span>
                  {dynamics.cls === 'red' ? <IconTrendUp /> : dynamics.cls === 'green' ? <IconTrendDown /> : <IconTrendUp />}
                </div>
                <div className={`metric-value ${dynamics.cls}`}>
                  {dynamics.text} <span style={{ fontSize: '0.7em', opacity: 0.5 }}>km</span>
                </div>
                {data?.change7dKm > 0.5 && (
                  <div style={{ fontSize: '0.7rem', color: '#ff6b6b', marginTop: '0.3rem' }}>
                    ↑ Front advanced toward you this week
                  </div>
                )}
              </div>
              <a href="https://deepstatemap.live" target="_blank" rel="noreferrer" className="source-link">
                <span className="source-dot" />
                <span className="source-name">DeepStateMap</span>
                <IconExternal />
              </a>
              <button className="sync-btn" onClick={handleGetLocation}>
                <IconRefresh spinning={loading} />
                {loading ? 'Updating...' : 'Rescan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donate + Map */}
      <div className="bottom-grid">
        <div className="map-container">
          <FrontlineMap
            userLat={location.lat}
            userLng={location.lng}
            frontLat={data?.nearestFrontlinePoint?.lat}
            frontLng={data?.nearestFrontlinePoint?.lng}
            distanceKm={data?.currentDistanceKm}
          />
          <div className="map-tag">
            <div className="ping" />
            <span>Pos {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
          </div>
        </div>
        <div className="context-card donate-card">
          <div className="context-bg-icon"><IconHeartBig /></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="context-card-header" style={{ marginBottom: '0.75rem' }}>
              <div className="context-icon donate"><IconHeart /></div>
              <h4 className="context-title donate">Support Ukraine</h4>
            </div>
            <p className="context-text donate">
              You are far from the front line, but your support brings victory closer. Every donation goes directly to defense and rebuilding.
            </p>
            <a href="https://u24.gov.ua/" target="_blank" rel="noreferrer" className="context-btn donate">
              <IconHeart />
              Donate via United24
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // ––– Render: Ukraine (free territory) –––
  const renderUkraineDashboard = () => {
    const grade = getUkraineThreatGrade(data?.currentDistanceKm);
    return (
      <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>

        {/* Main Readout */}
        <div className={`glass-card readout-card ${grade.cls}`}>
          <div className="scan-line" />
          <div className="readout-inner">
            <div className="readout-top">
              <div className="readout-main">
                <div className="readout-sys-label">
                  <span className={`pulse-dot ${loading ? 'yellow' : 'green'}`} />
                  Відстань до окупованих позицій
                </div>
                <div className={`status-label ${grade.cls}`}>{grade.label}</div>
                <div className="distance-display">
                  <span className={`distance-number ${grade.cls}`}>
                    {data ? Math.round(data.currentDistanceKm) : '—'}
                  </span>
                  <span className="distance-unit">км</span>
                </div>
                {/* Direction row */}
                {data?.nearestFrontlinePoint && (() => {
                  const dir = getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng);
                  return dir ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px' }}>
                      <span style={{ color: 'rgba(255,68,68,0.7)', fontSize: 16 }}>{dir.symbol}</span>
                      <span style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>{dir.region}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{dir.bearing}°</span>
                    </div>
                  ) : null;
                })()}
                <p className="status-message">{grade.msg}</p>
                {grade.advice && (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
                    {grade.advice}
                  </p>
                )}
              </div>

              <div className="metrics-panel">
                {/* 7-day dynamics */}
                <div className="metric-card">
                  <div className="metric-label">
                    <span>Зміна за 7 днів</span>
                    {dynamics.cls === 'red' ? <IconTrendUp /> : dynamics.cls === 'green' ? <IconTrendDown /> : <IconTrendUp />}
                  </div>
                  <div className={`metric-value ${dynamics.cls}`}>
                    {dynamics.text} <span style={{ fontSize: '0.7em', opacity: 0.5 }}>км</span>
                  </div>
                  {data?.change7dKm > 0.5 && (
                    <div style={{ fontSize: '0.7rem', color: '#ff6b6b', marginTop: '0.3rem' }}>
                      ↑ Фронт наблизився цього тижня
                    </div>
                  )}
                  {data?.change7dKm < -0.5 && (
                    <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '0.3rem' }}>
                      ↓ Фронт відсунувся цього тижня
                    </div>
                  )}
                </div>

                <a href="https://deepstatemap.live" target="_blank" rel="noreferrer" className="source-link">
                  <span className="source-dot" />
                  <span className="source-name">DeepStateMap</span>
                  <IconExternal />
                </a>

                <button className="sync-btn" onClick={handleGetLocation}>
                  <IconRefresh spinning={loading} />
                  {loading ? 'Оновлення...' : 'Синхронізація'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Evacuation Advice for critical zones */}
        {data?.currentDistanceKm < 100 && (
          <div className="context-card russia-card" style={{ padding: '2rem 2.5rem' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h4 style={{ color: '#ff6b6b', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                🏃 Офіційні ресурси евакуації
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a href="https://evakuacia.gov.ua" target="_blank" rel="noreferrer" className="context-btn russia" style={{ flex: 1, minWidth: 200, margin: 0 }}>
                  Евакуація.gov.ua <IconExternal />
                </a>
                <a href="https://t.me/evorog_bot" target="_blank" rel="noreferrer" className="context-btn russia" style={{ flex: 1, minWidth: 200, margin: 0 }}>
                  <IconSend /> @evorog_bot
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom: Map + War Crimes */}
        <div className="bottom-grid">
          <div className="map-container">
            <FrontlineMap
              userLat={location.lat}
              userLng={location.lng}
              frontLat={data?.nearestFrontlinePoint?.lat}
              frontLng={data?.nearestFrontlinePoint?.lng}
              distanceKm={data?.currentDistanceKm}
              directionLabel={data?.nearestFrontlinePoint ? getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng)?.region : null}
            />
            <div className="map-tag">
              <div className="ping" />
              <span>Поз. {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
          </div>
          {renderWarCrimesCard()}
        </div>
      </div>
    );
  };

  // ––– Determine header language –––
  const headerSubtitle = isAbroad
    ? 'Automated proximity analysis to Russian-occupied territories based on DeepStateUA intelligence data.'
    : 'Автоматизований аналіз відстані до окупованих Росією територій за даними розвідки DeepStateUA.';

  // Determine what to render after location
  const renderContent = () => {
    if (isEnemy) return renderEnemyDashboard();
    if (isOccupied) return renderOccupiedDashboard();
    if (isAbroad) return renderAbroadDashboard();
    return renderUkraineDashboard();
  };

  return (
    <div className="app-shell">
      <div className="bg-grid" />
      <div className={`bg-aura ${isEnemy || isOccupied ? 'danger' : status.cls}`} />
      <div className="bg-noise" />

      <div className="app-container">

        {/* Header */}
        <header className="header animate-in">
          <div className="header-badge">
            <IconCrosshair />
            <span>Sentry System v2.1</span>
          </div>
          <h1>Frontline<br />Radar</h1>
          <p className="header-subtitle">{headerSubtitle}</p>
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
                ? 'Allow location access to calculate your distance to Russian-occupied territory.'
                : 'Надайте доступ до геопозиції для розрахунку відстані до окупованих Росією територій.'}</p>

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
          renderContent()
        )}

        {/* Footer */}
        <footer className="footer">
          <div className="footer-divider">
            <div className="line" />
            <span>Слава Україні 🇺🇦</span>
            <div className="line" />
          </div>
          <div className="footer-meta">
            <div className="footer-meta-item">
              <span className="label">Джерело</span>
              <span className="value">DeepStateUA</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Engine</span>
              <span className="value">Turf.js</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Оновлено</span>
              <span className="value">{new Date().toLocaleTimeString('uk-UA')}</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Статус</span>
              <span className="value operational">Operational</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
