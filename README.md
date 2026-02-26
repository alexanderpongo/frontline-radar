# Frontline Radar 🇺🇦

Automated proximity analysis to Ukrainian front lines based on DeepStateUA intelligence data.

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Start dev server (API on :3001) + Vite dev server (client on :3000)
cd client && npm run dev -- --port 3000
# In another terminal:
node server.js
```

## Production Build

```bash
# Build client
npm run build

# Start production server (serves both API + static files)
PORT=3001 node server.js
# Open http://localhost:3001
```

## Deployment

### Option 1: Render.com (Recommended — FREE)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Deploy!
6. Custom domain: Settings → Custom Domains → Add your domain

> Free tier: 750 hours/month, auto-sleep after 15 min inactivity (spins up on next request).

### Option 2: Railway.app (~$5/month)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Railway auto-detects Node.js
3. Add environment variable: `PORT=3001`
4. Deploy
5. Custom domain: Settings → Domains → Add Custom Domain

> $5 free credit/month. Always-on, no cold starts.

### Option 3: Fly.io (FREE tier)

1. Install flyctl: `brew install flyctl`
2. Run:
```bash
fly launch
fly deploy
```
3. Custom domain: `fly certs add yourdomain.com`

> Free tier: 3 shared VMs, 256MB RAM each.

### Option 4: Docker (any VPS)

```bash
docker build -t frontline-radar .
docker run -p 3001:3001 frontline-radar
```

Works on any VPS: DigitalOcean ($4/mo), Hetzner ($3.29/mo), etc.

## Custom Domain Setup

1. Buy a domain (Namecheap ~$8/year, Cloudflare ~$8/year)
2. Point DNS to your hosting:
   - **Render/Railway:** They provide a CNAME record
   - **VPS:** A record → your server IP
3. Enable HTTPS (auto with Render/Railway/Fly.io, use Let's Encrypt for VPS)

## Testing Regions

Add `?testRegion=` to URL:
- `?testRegion=ukraine` — Ukrainian interface
- `?testRegion=russia` — Russian interface (enemy territory)
- `?testRegion=abroad` — English interface (international)

## Tech Stack

- **Frontend:** React + Vite (vanilla CSS)
- **Backend:** Express.js + Turf.js
- **Data Source:** [DeepStateMap API](https://deepstatemap.live)
- **Geo Analysis:** Turf.js (point-to-polygon distance)

## Project Structure

```
├── server.js            # Express API + static file serving
├── package.json         # Root dependencies
├── Dockerfile           # Container deployment
├── client/
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   └── index.css    # Complete design system
│   ├── dist/            # Production build (auto-generated)
│   └── package.json     # Client dependencies
```

---

**Слава Україні! 🇺🇦**
