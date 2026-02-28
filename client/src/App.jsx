import React, { useState, useRef, useCallback, useEffect } from 'react';
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
const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);
const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);

// ––– Threat grades for Ukraine –––
function getUkraineThreatGrade(dist, lang = 'uk') {
  const isEn = lang === 'en';
  if (!dist && dist !== 0) return {
    cls: 'safe',
    label: isEn ? 'Waiting...' : 'Очікування...',
    msg: isEn ? 'System ready to scan.' : 'Система готова до сканування.'
  };
  if (dist < 30) return {
    cls: 'critical',
    label: isEn ? 'URGENT EVACUATION' : 'ТЕРМІНОВА ЕВАКУАЦІЯ',
    msg: isEn
      ? 'You are in an active combat zone. Follow official evacuation orders immediately. Stay in shelter!'
      : 'Ви знаходитесь у зоні активних бойових дій. Негайно дотримуйтесь офіційних оголошень про евакуацію. Перебувайте в укритті!',
    advice: isEn
      ? 'Distance to the frontline is under 30 km — direct risk zone.'
      : 'Відстань до лінії фронту менша за 30 км — зона прямого ризику.'
  };
  if (dist < 100) return {
    cls: 'danger',
    label: isEn ? 'HIGH DANGER' : 'ВИСОКА НЕБЕЗПЕКА',
    msg: isEn
      ? 'You are in a potential artillery range. Seriously consider evacuation and prepare your emergency kit.'
      : 'Ви знаходитесь у зоні потенційного артилерійського обстрілу. Рекомендуємо серйозно розглянути евакуацію та підготувати тривожну валізу.',
    advice: isEn
      ? 'Distance under 100 km — long-range artillery range.'
      : 'Відстань до лінії фронту менша за 100 км — зона дальнобійної артилерії.'
  };
  if (dist < 200) return {
    cls: 'warning',
    label: isEn ? 'ELEVATED AWARENESS' : 'ЗОНА ПІДВИЩЕНОЇ УВАГИ',
    msg: isEn
      ? 'Your area is under monitoring. Follow official channels, know your nearest shelter, and keep an emergency kit ready.'
      : 'Ваш район у зоні моніторингу. Слідкуйте за офіційними каналами, знайте місце найближчого укриття та тримайте тривожну валізу напоготові.',
    advice: isEn
      ? 'Distance under 200 km — monitoring zone.'
      : 'Відстань до лінії фронту менша за 200 км — зона контролю.'
  };
  if (dist < 400) return {
    cls: 'warning',
    label: isEn ? 'POTENTIAL THREAT' : 'ПОТЕНЦІЙНА ЗАГРОЗА',
    msg: isEn
      ? 'You are relatively far from the front line, but missile strikes can reach your region. Know your nearest shelter.'
      : 'Ви відносно далеко від лінії фронту, але ракетні удари можуть досягати вашого регіону. Знайте найближче укриття.',
    advice: isEn
      ? 'Distance under 400 km.'
      : 'Відстань до лінії фронту менша за 400 км.'
  };
  if (dist < 700) return {
    cls: 'safe',
    label: isEn ? 'STABLE ZONE' : 'СТАБІЛЬНА ЗОНА',
    msg: isEn
      ? 'No direct combat threat now. Keep monitoring the situation.'
      : 'Прямої загрози бойових дій зараз немає. Продовжуйте стежити за ситуацією.',
    advice: isEn
      ? 'Distance to the frontline over 400 km.'
      : 'Відстань до лінії фронту понад 400 км.'
  };
  return {
    cls: 'safe',
    label: isEn ? 'STABLE ZONE' : 'СТАБІЛЬНА ЗОНА',
    msg: isEn ? 'Safe distance from the front line.' : 'Безпечна відстань від лінії фронту.',
    advice: isEn
      ? `~${Math.round(dist)} km from the frontline.`
      : `~${Math.round(dist)} км від лінії фронту.`
  };
}

// ––– Compass bearing: user → nearest frontline point –––
function getDirection(userLat, userLng, frontLat, frontLng, lang = 'uk') {
  if (!frontLat || !frontLng) return null;
  const isEn = lang === 'en';

  // Compute bearing
  const φ1 = userLat * Math.PI / 180;
  const φ2 = frontLat * Math.PI / 180;
  const Δλ = (frontLng - userLng) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180 / Math.PI) + 360) % 360;

  // Compass label
  const dirs = [
    { max: 22.5, ua: 'Північ', en: 'North', symbol: '↑' },
    { max: 67.5, ua: 'Сх.-Пн.', en: 'NE', symbol: '↗' },
    { max: 112.5, ua: 'Схід', en: 'East', symbol: '→' },
    { max: 157.5, ua: 'Сх.-Пд.', en: 'SE', symbol: '↘' },
    { max: 202.5, ua: 'Південь', en: 'South', symbol: '↓' },
    { max: 247.5, ua: 'Зх.-Пд.', en: 'SW', symbol: '↙' },
    { max: 292.5, ua: 'Захід', en: 'West', symbol: '←' },
    { max: 337.5, ua: 'Зх.-Пн.', en: 'NW', symbol: '↖' },
    { max: 360, ua: 'Північ', en: 'North', symbol: '↑' },
  ];
  const dir = dirs.find(d => bearing < d.max);

  // Named region hint
  let region = '';
  const fLat = frontLat, fLng = frontLng;
  const suffix = isEn ? 'direction' : 'напрям';

  if (fLat > 50.0 && fLng < 37) region = isEn ? 'Kharkiv' : 'Харківський';
  else if (fLat > 49.5 && fLng >= 37) region = isEn ? 'Luhansk' : 'Луганський';
  else if (fLat >= 48.5 && fLng >= 37) region = isEn ? 'Donetsk' : 'Донецький';
  else if (fLat >= 47.5 && fLng >= 36) region = isEn ? 'Donetsk' : 'Донецький';
  else if (fLat >= 47.0 && fLng >= 34 && fLng < 36.5) region = isEn ? 'Zaporizhzhia' : 'Запорізький';
  else if (fLat >= 46.0 && fLng >= 32 && fLng < 34.5) region = isEn ? 'Kherson' : 'Херсонський';
  else if (fLat < 46.5 && fLng >= 33) region = isEn ? 'Kherson' : 'Херсонський';
  else region = isEn ? dir?.en : dir?.ua;

  return {
    bearing: Math.round(bearing),
    symbol: dir?.symbol,
    label: isEn ? dir?.en : dir?.ua,
    region: `${region} ${suffix}`
  };
}

// ––– Detect mobile/touch device –––
function isMobileDevice() {
  return typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent);
}

// ––– Instagram Story Card Generator –––
function ShareStoryCard({ distanceKm, directionInfo, frontLat, frontLng, userLat, userLng, lang, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const isUa = lang === 'uk';

  const distNum = distanceKm ? Math.round(distanceKm).toLocaleString('uk-UA') : '—';
  const distNumEn = distanceKm ? Math.round(distanceKm).toLocaleString() : '—';
  const regionText = directionInfo?.region || '';

  const isMobile = isMobileDevice();
  // canShare: only used on mobile (share sheet)
  const canShare = isMobile && typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare;

  // Generate PNG blob from the card element
  const generateBlob = useCallback(async () => {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }, []);

  // Save / Download PNG
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const blob = await generateBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'frontradар-distance.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  }, [generateBlob]);

  // Share via Web Share API (mobile: opens native share sheet)
  const [sharing, setSharing] = useState(false);
  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const blob = await generateBlob();
      const file = new File([blob], 'frontradar-distance.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Frontradar',
          text: isUa ? 'Відстань до лінії фронту' : 'My distance to the frontline',
        });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'frontradar-distance.png';
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e);
    } finally {
      setSharing(false);
    }
  }, [generateBlob, isUa]);

  const siteLine = 'frontradar.online';

  return (
    <div className="story-overlay" onClick={onClose}>
      <div className="story-modal" onClick={e => e.stopPropagation()}>
        <button className="story-close" onClick={onClose}>✕</button>
        <h3 className="story-modal-title">
          {isUa ? 'ПОДІЛИТИСЬ' : 'SHARE'}
        </h3>
        <p className="story-modal-hint">
          {isMobile
            ? (isUa ? 'Поділіться або збережіть картку' : 'Share or save the card')
            : (isUa ? 'Збережіть картку та опублікуйте в Stories' : 'Save the card and post it to Stories')}
        </p>

        {/* The card itself */}
        <div className="story-card-wrap">
          <div className="story-card" ref={cardRef}>
            <div className="story-bg" />

            {/* Top badge */}
            <div className="story-badge">FRONTRADAR.ONLINE 🇺🇦</div>

            {/* Main number block */}
            <div className="story-center">
              <div className="story-label-sm">
                {isUa ? 'відстань до фронту від мене' : 'my distance to the frontline'}
              </div>
              <div className="story-distance-row">
                <span className="story-distance">{isUa ? distNum : distNumEn}</span>
                <span className="story-unit">{isUa ? 'КМ' : 'KM'}</span>
              </div>
              {regionText && (
                <div className="story-region">
                  <span className="story-arrow">{directionInfo?.symbol || '→'}</span>
                  {regionText}
                </div>
              )}
            </div>

            {/* CTA lines */}
            <div className="story-cta">
              <div className="story-cta-line story-cta-1">
                {isUa ? "Пам'ятайте — ця відстань може зменшитись." : 'Remember — this distance could shrink.'}
              </div>
              <div className="story-cta-line story-cta-2">
                {isUa ? 'Підтримайте Україну, поки вона тримає лінію.' : 'Support Ukraine while it holds the line.'}
              </div>
            </div>

            {/* Bottom */}
            <div className="story-bottom">
              <div className="story-site">{siteLine}</div>
              <div className="story-source">{isUa ? 'Дані: DeepStateUA' : 'Data: DeepStateUA'}</div>
            </div>

            <div className="story-ring story-ring-1" />
            <div className="story-ring story-ring-2" />
            <div className="story-ring story-ring-3" />
          </div>
        </div>

        {/* Mobile: SHARE TO SOCIALS + SAVE */}
        {isMobile ? (
          <>
            {canShare && (
              <button
                className="story-share-btn"
                onClick={handleShare}
                disabled={sharing || downloading}
              >
                <IconInstagram />
                {sharing
                  ? (isUa ? 'Відкриття...' : 'Opening...')
                  : (isUa ? 'Поділитись у соцмережах' : 'Share to Socials')}
              </button>
            )}
            <button
              className="story-download-btn"
              onClick={handleDownload}
              disabled={downloading || sharing}
            >
              <IconDownload />
              {downloading
                ? (isUa ? 'Збереження...' : 'Saving...')
                : (isUa ? 'Зберегти' : 'Save')}
            </button>
            <p className="story-tip">
              {isUa
                ? 'Поділіться напряму або збережіть і додайте в Stories вручну'
                : 'Share directly or save and add to Stories manually'}
            </p>
          </>
        ) : (
          /* Desktop: SAVE IMAGE only */
          <>
            <button
              className="story-share-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              <IconDownload />
              {downloading
                ? (isUa ? 'Генерація...' : 'Generating...')
                : (isUa ? 'Зберегти зображення' : 'Save Image')}
            </button>
            <p className="story-tip">
              {isUa
                ? 'Збережіть та опублікуйте в Instagram Stories вручну'
                : 'Save and post to Instagram Stories manually'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStory, setShowStory] = useState(false);
  const isDevHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // lang: auto-detect on first render, then user can override
  const defaultLang = () => {
    if (isDevHost) {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('testRegion') || '';
      if (r === 'abroad' || r === 'europe') return 'en';
    }
    return 'uk'; // Default to UA for prod unless user toggles
  };
  const [lang, setLang] = useState(defaultLang);
  const isEn = lang === 'en';

  // TEST MODE: override region via URL param (dev only)
  const getRegion = () => {
    if (isDevHost) {
      const params = new URLSearchParams(window.location.search);
      const testRegion = params.get('testRegion');
      if (testRegion && ['russia', 'occupied_ukraine', 'ukraine', 'abroad', 'europe'].includes(testRegion)) {
        return testRegion;
      }
    }
    return data?.region || 'ukraine';
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
      // Auto-set language based on server region if not yet manually changed
      // But don't overwrite if URL explicitly set a test region or language
    } catch (err) {
      setError(isEn ? 'Failed to fetch data from server.' : 'Не вдалося отримати дані від сервера.');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  // ––– TEST MODE: Auto-load coordinates from URL (dev only) –––
  useEffect(() => {
    if (!isDevHost) return;
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ lat, lng });
      fetchProximity(lat, lng);
    }
  }, [isDevHost]);

  const handleGetLocation = () => {
    setError(null);
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchProximity(latitude, longitude);
        },
        () => {
          setError(isEn ? 'Location access denied.' : 'Доступ до геопозиції відхилено.');
          setLoading(false);
        }
      );
    } else {
      setError(isEn ? 'Geolocation not supported.' : 'Геолокація не підтримується.');
      setLoading(false);
    }
  };

  // ––– Status for abroad (European) users –––
  const getAbroadStatus = (dist) => {
    if (!dist && dist !== 0) return {
      cls: 'safe',
      label: isEn ? 'Waiting...' : 'Очікування...',
      msg: isEn ? 'System ready to scan.' : 'Система готова до сканування.'
    };
    if (dist < 200) return {
      cls: 'critical',
      label: isEn ? 'Critical Proximity' : 'Критична близькість',
      msg: isEn ? 'The front line is extremely close. Immediate attention required.' : 'Лінія фронту надзвичайно близько. Необхідна підвищена увага.'
    };
    if (dist < 500) return {
      cls: 'danger',
      label: isEn ? 'High Alert' : 'Висока тривога',
      msg: isEn ? 'You are within range of the active conflict zone.' : 'Ви знаходитесь у зоні досяжності активного конфлікту.'
    };
    if (dist < 1200) return {
      cls: 'warning',
      label: isEn ? 'Watch Zone' : 'Зона нагляду',
      msg: isEn ? 'Ukraine stands between you and the threat. Stay informed.' : 'Україна стоїть між вами та загрозою. Будьте поінформовані.'
    };
    return {
      cls: 'safe',
      label: isEn ? 'Monitored' : 'Під наглядом',
      msg: isEn ? 'The distance is significant, but the conflict is ongoing.' : 'Відстань значна, але конфлікт триває.'
    };
  };

  const status = isAbroad
    ? getAbroadStatus(data?.currentDistanceKm)
    : getUkraineThreatGrade(data?.currentDistanceKm, lang);

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
      russia: {
        title: 'Цена километров',
        body: 'Каждый метр освобождённой земли пропитан доказательствами преступлений, которые не имеют срока давности. Мир должен видеть правду.',
        btn: 'Доказательства военных преступлений'
      },
      uk: {
        title: 'Ціна кілометрів',
        body: 'Кожен метр звільненої землі та кожен кілометр відстані просякнутий доказами злочинів, які не мають терміну давності. Світ повинен бачити правду.',
        btn: 'Докази воєнних злочинів'
      },
      en: {
        title: 'The Price of Kilometers',
        body: 'Every meter of liberated land and every kilometer of distance is soaked with evidence of crimes that have no statute of limitations. The world must see the truth.',
        btn: 'Evidence of War Crimes'
      }
    };
    let key;
    if (isEnemy) key = 'russia';
    else key = isEn ? 'en' : 'uk';
    const t = texts[key];
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
  const renderOccupiedDashboard = () => {
    const isUa = lang === 'uk';
    return (
      <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>
        {/* You are Ukraine message */}
        <div className="context-card" style={{ textAlign: 'center', padding: '4rem 3rem', background: 'linear-gradient(135deg, rgba(0,87,183,0.25) 0%, rgba(255,215,0,0.15) 100%)', borderColor: 'rgba(255,215,0,0.3)' }}>
          <div className="context-bg-icon"><IconHomeBig /></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 0 40px rgba(255,215,0,0.3)' }}>🇺🇦</div>
            <h2 style={{ fontSize: '1.9rem', marginBottom: '1rem', color: '#FFD700', fontWeight: 800 }}>
              {isUa ? 'Ви — частина України' : 'You are part of Ukraine'}
            </h2>
            <p style={{ maxWidth: 520, margin: '0 auto 1.5rem', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
              {isUa
                ? 'Тимчасова окупація не змінює правду: ця земля — українська. Крим, Донбас, Херсонщина, Запоріжжя — кожне місто і кожне село повернеться додому. Ви не самотні.'
                : 'Temporary occupation does not change the truth: this land is Ukrainian. Crimea, Donbas, Kherson, Zaporizhzhia — every city and every village will return home. You are not alone.'}
            </p>
            <p style={{ maxWidth: 480, margin: '0 auto 2rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              {isUa
                ? 'Якщо ви бачите рух техніки, розташування окупантів або будь-яку корисну інформацію — передайте її через офіційний бот Міністерства цифрової трансформації України:'
                : 'If you see the movement of equipment, the location of the occupiers or any useful information — report it via the official bot of the Ministry of Digital Transformation of Ukraine:'}
            </p>
            <a
              href="https://t.me/evorog_bot"
              target="_blank"
              rel="noreferrer"
              className="context-btn donate"
              style={{ maxWidth: 420, margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #0057b7 0%, #005bac 100%)', borderColor: 'rgba(0,87,183,0.5)' }}
            >
              <IconSend />
              {isUa ? 'Відкрити @evorog_bot в Telegram' : 'Open @evorog_bot in Telegram'}
            </a>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,215,0,0.7)', marginTop: '1rem' }}>
              {isUa ? 'Слава Україні! 🇺🇦 Ми повернемось.' : 'Slava Ukraini! 🇺🇦 We will return.'}
            </p>
          </div>
        </div>
        {renderWarCrimesCard()}
      </div>
    );
  };

  // ––– Render: Europe / Abroad –––
  const renderAbroadDashboard = () => (
    <div className="dashboard animate-in" style={{ animationDelay: '0.1s' }}>

      {/* Awareness message */}
      <div className="context-card donate-card" style={{ background: 'linear-gradient(135deg, rgba(20,20,40,0.5) 0%, rgba(10,10,25,0.4) 100%)', borderColor: 'rgba(100,100,200,0.2)' }}>
        <div className="context-bg-icon"><IconShieldBig /></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="context-card-header" style={{ marginBottom: '1rem' }}>
            <div className="context-icon donate"><IconShield /></div>
            <h4 className="context-title donate">
              {isEn ? "War Doesn't Stay on the Map" : "Війна не залишається на карті"}
            </h4>
          </div>
          <p className="context-text donate" style={{ marginBottom: '1.2rem', lineHeight: 1.75 }}>
            {isEn
              ? `In a world where borders connect us all, a conflict that seems far away rarely stays that way. For ${data ? Math.round(data.currentDistanceKm) : '—'} km, Ukrainian soldiers have held a line that keeps millions of people in their homes — on every continent — without even knowing it.`
              : `У світі, де кордони поєднують нас усіх, конфлікт, який здається далеким, рідко залишається таким. Вже на відстані ${data ? Math.round(data.currentDistanceKm) : '—'} км українські воїни тримають лінію, яка оберігає мільйони людей у їхніх домівках — на кожному континенті — часто без їхнього відома.`}
          </p>
          <p className="context-text donate" style={{ color: 'rgba(180,210,255,0.8)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {isEn
              ? "Peace is not guaranteed by geography. It is maintained by people who choose to act. The most meaningful thing anyone can do right now is to support Ukraine's resilience."
              : "Мир не гарантується географією. Його підтримують люди, які обирають діяти. Найважливіше, що може зробити кожен зараз — це підтримати стійкість України."}
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
                {isEn ? 'Distance to the Frontline' : 'Відстань до лінії фронту'}
              </div>
              <div className={`status-label ${status.cls}`}>{status.label}</div>
              <div className="distance-display">
                <span className={`distance-number ${status.cls}`}>
                  {data ? Math.round(data.currentDistanceKm) : '—'}
                </span>
                <span className="distance-unit">{isEn ? 'km' : 'км'}</span>
              </div>
              {/* Direction row */}
              {data?.nearestFrontlinePoint && location && (() => {
                const dir = getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng, lang);
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
                  <span>{isEn ? '7-day Front Shift' : 'Зміна за 7 днів'}</span>
                  {dynamics.cls === 'red' ? <IconTrendUp /> : dynamics.cls === 'green' ? <IconTrendDown /> : <IconTrendUp />}
                </div>
                <div className={`metric-value ${dynamics.cls}`}>
                  {dynamics.text} <span style={{ fontSize: '0.7em', opacity: 0.5 }}>{isEn ? 'km' : 'км'}</span>
                </div>
                {data?.change7dKm > 0.5 && (
                  <div style={{ fontSize: '0.7rem', color: '#ff6b6b', marginTop: '0.3rem' }}>
                    {isEn ? '↑ Front advanced toward you' : '↑ Фронт наблизився'}
                  </div>
                )}
                {data?.change7dKm < -0.5 && (
                  <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '0.3rem' }}>
                    {isEn ? '↓ Front moved away' : '↓ Фронт відсунувся'}
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
            directionLabel={data?.nearestFrontlinePoint && location ? getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng, lang) : null}
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
              <h4 className="context-title donate">{isEn ? 'Support Ukraine' : 'Підтримай Україну'}</h4>
            </div>
            <p className="context-text donate">
              {isEn
                ? 'You are far from the front line, but your support brings victory closer. Every donation goes directly to defense and rebuilding.'
                : 'Ви далеко від фронту, але ваша підтримка наближає перемогу. Кожен донат іде на захист та відновлення України.'}
            </p>
            <a href="https://u24.gov.ua/" target="_blank" rel="noreferrer" className="context-btn donate">
              <IconHeart />
              {isEn ? 'Donate via United24' : 'Підтримати через United24'}
            </a>
            <button
              className="context-btn share-story-btn"
              onClick={() => setShowStory(true)}
              style={{ marginTop: '0.75rem' }}
            >
              <IconInstagram />
              {isEn ? 'SHARE' : 'ПОДІЛИТИСЬ'}
            </button>
          </div>
        </div>
      </div>
      {renderWarCrimesCard()}
    </div>
  );

  // ––– Render: Ukraine (free territory) –––
  const renderUkraineDashboard = () => {
    // All text inside is driven by `isEn` so changing lang re-renders correctly
    const grade = getUkraineThreatGrade(data?.currentDistanceKm, lang);
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
                  {isEn ? 'Distance to the Frontline' : 'Відстань до лінії фронту'}
                </div>
                <div className={`status-label ${grade.cls}`}>{grade.label}</div>
                <div className="distance-display">
                  <span className={`distance-number ${grade.cls}`}>
                    {data ? Math.round(data.currentDistanceKm) : '—'}
                  </span>
                  <span className="distance-unit">{isEn ? 'km' : 'км'}</span>
                </div>
                {/* Direction row */}
                {data?.nearestFrontlinePoint && (() => {
                  const dir = getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng, lang);
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
                    <span>{isEn ? '7-day Front Shift' : 'Зміна за 7 днів'}</span>
                    {dynamics.cls === 'red' ? <IconTrendUp /> : dynamics.cls === 'green' ? <IconTrendDown /> : <IconTrendUp />}
                  </div>
                  <div className={`metric-value ${dynamics.cls}`}>
                    {dynamics.text} <span style={{ fontSize: '0.7em', opacity: 0.5 }}>{isEn ? 'km' : 'км'}</span>
                  </div>
                  {data?.change7dKm > 0.5 && (
                    <div style={{ fontSize: '0.7rem', color: '#ff6b6b', marginTop: '0.3rem' }}>
                      {isEn ? '↑ Front advanced toward you this week' : '↑ Фронт наблизився цього тижня'}
                    </div>
                  )}
                  {data?.change7dKm < -0.5 && (
                    <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '0.3rem' }}>
                      {isEn ? '↓ Front moved away this week' : '↓ Фронт відсунувся цього тижня'}
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
                  {loading ? (isEn ? 'Updating...' : 'Оновлення...') : (isEn ? 'Rescan' : 'Синхронізація')}
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
                {isEn ? 'Official Evacuation Resources' : 'Офіційні ресурси евакуації'}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a href="https://bf.diia.gov.ua/articles/yak-znaity-informatsiiu-i-dopomohu-dlia-evakuatsii-u-vashomu-misti" target="_blank" rel="noreferrer" className="context-btn russia" style={{ flex: 1, minWidth: 200, margin: 0 }}>
                  {isEn ? 'Evacuation Guide (Diia)' : 'Гід з евакуації (Дія)'} <IconExternal />
                </a>
                <a href="https://t.me/Evacuation2022_bot" target="_blank" rel="noreferrer" className="context-btn russia" style={{ flex: 1, minWidth: 200, margin: 0 }}>
                  <IconSend /> @Evacuation2022_bot
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
              directionLabel={data?.nearestFrontlinePoint ? getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng, lang)?.region : null}
            />
            <div className="map-tag">
              <div className="ping" />
              <span>Поз. {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
          </div>
          {renderWarCrimesCard()}
        </div>

        {/* Share to Instagram */}
        <div className="share-section">
          <button
            className="share-main-btn"
            onClick={() => setShowStory(true)}
          >
            <IconInstagram />
            {isEn ? 'SHARE' : 'ПОДІЛИТИСЬ'}
          </button>
          <p className="share-hint">{isEn ? 'Share your distance to the frontline — this matters' : 'Розкажіть про відстань до фронту — про це важливо пам\'ятати'}</p>
        </div>

      </div>
    );
  };



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
          {/* Top row: badge left, lang toggle right */}
          <div className="header-top-row">
            <div className="header-badge">
              <IconCrosshair />
              <span>Sentry System v2.1</span>
            </div>
          </div>
          {/* Centered lang toggle */}
          <div className="lang-toggle-wrap">
            <button
              className="lang-toggle-center"
              onClick={() => setLang(l => l === 'uk' ? 'en' : 'uk')}
              title={isEn ? 'Switch to Ukrainian' : 'Switch to English'}
            >
              <span className={lang === 'uk' ? 'lang-btn-active' : 'lang-btn'}>UA</span>
              <span className="lang-divider" />
              <span className={lang === 'en' ? 'lang-btn-active' : 'lang-btn'}>EN</span>
            </button>
          </div>
          <h1>Front<br />Radar</h1>
          <p className="header-subtitle">
            {isEn
              ? 'Automated proximity analysis to the frontline based on DeepStateUA intelligence data.'
              : 'Автоматизований аналіз відстані до лінії фронту за даними розвідки DeepStateUA.'}
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

              <h2>{isEn ? 'System Ready' : 'Система готова'}</h2>
              <p>{isEn
                ? 'Allow location access to calculate your distance to the frontline.'
                : 'Надайте доступ до геопозиції для розрахунку відстані до лінії фронту.'}</p>

              <div className="cta-wrap">
                <div className="cta-glow" />
                <button className="cta-btn" onClick={handleGetLocation} disabled={loading}>
                  {loading ? <IconRefresh spinning /> : <IconZap />}
                  {loading
                    ? (isEn ? 'Scanning...' : 'Зчитування...')
                    : (isEn ? 'Initiate Scan' : 'Ініціювати сканування')}
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
            <span>{isEn ? 'Glory to Ukraine 🇺🇦' : 'Слава Україні 🇺🇦'}</span>
            <div className="line" />
          </div>
          <div className="footer-meta">
            <div className="footer-meta-item">
              <span className="label">{isEn ? 'Source' : 'Джерело'}</span>
              <span className="value">DeepStateUA</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">Engine</span>
              <span className="value">Turf.js</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">{isEn ? 'Updated' : 'Оновлено'}</span>
              <span className="value">{new Date().toLocaleTimeString(isEn ? 'en-US' : 'uk-UA')}</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">{isEn ? 'Status' : 'Статус'}</span>
              <span className="value operational">Operational</span>
            </div>
            <div className="footer-meta-item">
              <span className="label">{isEn ? 'Developer' : 'Розробник'}</span>
              <a
                href="https://www.linkedin.com/in/alexanderpongo/"
                target="_blank"
                rel="noreferrer"
                className="value"
                style={{ textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                {isEn ? 'Oleksandr Pongo' : 'Олександр Понго'}
              </a>
            </div>
          </div>
        </footer>

        {showStory && (
          <ShareStoryCard
            distanceKm={data?.currentDistanceKm}
            directionInfo={data?.nearestFrontlinePoint && location ? getDirection(location.lat, location.lng, data.nearestFrontlinePoint.lat, data.nearestFrontlinePoint.lng, lang) : null}
            frontLat={data?.nearestFrontlinePoint?.lat}
            frontLng={data?.nearestFrontlinePoint?.lng}
            userLat={location?.lat}
            userLng={location?.lng}
            lang={lang}
            onClose={() => setShowStory(false)}
          />
        )}

      </div>
    </div>
  );
}

export default App;
