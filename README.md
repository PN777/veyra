<div align="center">

# ⬡ VEYRA 2.0

### CLARITY ACROSS EVERY THREAT

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL-v6.7-396CB2?style=for-the-badge)](https://maplibre.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-C8A52D?style=for-the-badge)](LICENSE)

**A unified geospatial intelligence dashboard synthesizing real-time aviation, maritime traffic, surveillance cameras, seismic activity, conflict hotspots, live news feeds, and OSINT threat reconnaissance into a high-performance GPU-accelerated interface.**

[Architecture](#architecture) · [Getting Started](#installation--setup) · [Features](#key-capabilities) · [Routing & Navigation](#turn-by-turn-directions) · [Docker Deployment](#docker-deployment)

</div>

---

## Overview

**VEYRA 2.0** is an enterprise-grade situational awareness and open-source intelligence (OSINT) platform. Built upon **Next.js 16**, **MapLibre GL 6.7**, and **Tailwind CSS v4**, VEYRA renders tens of thousands of real-time entities with native WebGL hardware acceleration at consistent 60 FPS in both 3D spherical globe and 2D Mercator projections.

---

## Key Capabilities

| Domain | Entities & Coverage | Upstream Intelligence Sources |
|---|---|---|
| **Aviation** | Commercial, military, private, government aircraft | OpenSky Network & ADS-B feeds |
| **Maritime** | 39 global strategic ports, major naval chokepoints | Real-time AIS & naval telemetry |
| **CCTV Surveillance** | 17,000+ public video streams & traffic feeds | TfL, WSDOT, Caltrans, ODOT, MDOT, HKTD, Taiwan THB, NZTA |
| **Seismic Activity** | Global M2.5+ earthquake alerts & shake maps | USGS Real-time Earthquake Hazards |
| **Thermal & Fires** | Global active fire hotspots | NASA FIRMS VIIRS/MODIS |
| **Routing / Directions** | Turn-by-turn auto & transit routing with alternative paths | Valhalla engine with OSRM fallback |
| **OSINT Recon** | IP intelligence, Shodan sweeps, subdomains, whois, SSL, headers | Integrated VEYRA Recon Scanner daemon |
| **Global Markets** | Crypto telemetry, space weather indices, exchange rates | Multi-exchange feeds & NOAA SWPC |
| **Weather & Radar** | Global precipitation radar, surface wind vectors, clouds | NOAA GFS, RainViewer API |

---

## Architecture

```
                                  +---------------------------------------+
                                  |         VEYRA Browser Client          |
                                  |   (MapLibre GL 6 + React 19 Engine)   |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS / Tile Protocols
                                                      v
                                  +---------------------------------------+
                                  |        Next.js 16 App Router          |
                                  |   (Turbopack Server & API Proxies)    |
                                  +-------------------+-------------------+
                                                      |
                 +-------------------+----------------+--------------------+
                 |                   |                                     |
                 v                   v                                     v
      +--------------------+  +--------------------+             +-------------------+
      |  Geospatial Tiles  |  |  Directions Engine |             | OSINT & Telemetry |
      |  - CARTO CDN       |  |  - Valhalla        |             | - OpenSky Network |
      |  - ArcGIS World    |  |  - OSRM Fallback   |             | - USGS Earthquakes|
      |  - RainViewer      |  +--------------------+             | - NOAA Space/Wind |
      +--------------------+                                     | - VEYRA Scanner   |
                                                                 +-------------------+
```

### Core Architecture Highlights
- **Direct High-Throughput Tile Streaming**: Direct client-side CDN streaming of CARTO vector tiles and raster tiles with optional zero-latency proxy fallback.
- **Dual Map Projection System**: Seamless real-time switching between 3D Globe (`projection: 'globe'`) and 2D Planar (`projection: 'mercator'`) with unified coordinate framing.
- **Turn-by-Turn Routing Engine**: Deep integration with Valhalla routing and polyline geometry decoders with automatic fallback to OSRM.
- **Micro-Daemon Scanner Integration**: Standalone Node.js daemon (port 7700) executing zero-dependency DNS, SSL, header, and subdomain threat scans.

---

## Installation & Setup

### Prerequisites
- **Node.js**: `v20.x` or later (Node 22+ recommended) — [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)
- **GPU / Browser**: Modern browser supporting WebGL2 (Chrome, Edge, Firefox, Brave)

---

### Step 1: Download the Project

#### Option A: Clone with Git (Recommended)
```bash
git clone https://github.com/rsaidhanush/veyra.git
cd veyra
```

#### Option B: Download ZIP Archive
1. Click the green **Code** button on the GitHub repository.
2. Select **Download ZIP**.
3. Extract the ZIP archive to your desired folder.
4. Open your terminal / PowerShell in that directory:
   ```powershell
   cd path/to/extracted/veyra
   ```

---

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Prepare Map Workers & Vendors
Generate the local offline WebGL worker scripts required by MapLibre GL:
```bash
node tools/prepare-map-worker.mjs
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure optional API credentials if needed:
```env
SCANNER_URL=http://localhost:7700
SCANNER_KEY=your_generated_secret_key
# Optional Intelligence Integrations
HELIUS_API_KEY=
ETHERSCAN_API_KEY=
GEMINI_API_KEY=
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment

### Standard Production Build
```bash
# 1. Clean previous builds
npm run build

# 2. Start the optimized server
npm start
```

### Docker Deployment
Build and run VEYRA as a containerized microservice:

```bash
# Build Docker image
docker build -t veyra:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --name veyra-intel veyra:latest
```

---

## Turn-by-Turn Directions & Routing

VEYRA incorporates an interactive routing engine:
1. Click the **Directions** icon in the right-hand utility rail or right-click any point on the globe and choose **Directions to here**.
2. Enter origin and destination locations (geocoded via Nominatim).
3. The platform generates an optimal turn-by-turn route, displaying distance, travel duration, active maneuver steps, and alternate routes.
4. Active route coordinates are rendered on the map with custom high-contrast VEYRA teal-amber vectors and dynamic viewpoint framing.

---

## Hotkeys & Keyboard Navigation

| Key | Action |
|---|---|
| `3` / `2` | Switch between 3D Globe and 2D Flat Map |
| `F` | Toggle Fullscreen Mode |
| `R` | Reset Camera to Global Overview |
| `L` | Toggle Layers Panel |
| `M` | Toggle Markets & Space Weather Panel |
| `O` | Open Threat Intelligence Assistant |
| `?` | Open Keyboard Shortcuts Modal |
| `ESC` | Dismiss Open Modals & Panels |

---

## Verification & Testing

VEYRA includes a built-in end-to-end Playwright test suite validating every panel, view mode, and API endpoint:

```bash
# Run full automated validation
node test_targeted.js
```

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for full details.
