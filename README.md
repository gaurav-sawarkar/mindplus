# 🛰️ TERRAWATCH — Satellite-Based Hypothetical Disaster Detection & Impact Mapping

A modern, responsive web application designed for emergency disaster triage, remote sensing evaluation, and hackathon presentation. Built with pure **HTML5, CSS3, and JavaScript**, TERRAWATCH provides rapid multi-spectral flood delineation, wildfire burn severity mapping, and urban structural damage analysis using simulated Earth observation satellite telemetry.

---

## 📌 Project Overview & Hackathon Alignment

In acute disaster scenarios (rapid flash floods, wildfire fronts, or urban seismic events), terrestrial communication networks and roads are frequently severed. Satellite remote sensing—specifically **Synthetic Aperture Radar (SAR)** and **Optical Multi-Spectral Imagery**—provides immediate, all-weather situational awareness.

**TERRAWATCH** serves as a prototype emergency operations dashboard that allows decision-makers and relief coordinators to:
1. **Monitor Active Hazard Zones**: Floods (inundation extent), wildfires (thermal fronts & burn scars), and urban damage (structural collapse & debris).
2. **Perform Demonstration Multi-Spectral Analysis**: Upload custom satellite images or select pre-configured scenes, adjust detection thresholds, and run simulated change-detection pipelines.
3. **Compare Before & After Satellite Imagery**: Use an interactive split-screen slider to isolate baseline terrain against detected disaster anomalies.
4. **Inspect Impact Maps & Critical Infrastructure**: View affected roadways, hospitals, bridges, electrical substations, and safe evacuation corridors.
5. **Review Scientific Methodologies**: Understand Normalized Difference Water Index (NDWI), Normalized Burn Ratio (NBR/dNBR), and SAR backscatter drops ($\Delta\sigma^0$).
6. **Export Instant Situation Reports (SITREP)**: Download civil defense incident briefing files for field coordination.

> [!IMPORTANT]
> **Academic & Hackathon Transparency Notice**:
> This prototype is designed for demonstration and triage UI/UX evaluation. While all remote sensing formulas (NDWI, NBR, dNBR, SAR backscatter change $\Delta\sigma^0$) adhere to standard ESA Copernicus and USGS scientific specifications, the telemetry and damage polygons are rendered in **demonstration/simulation mode** for hackathon prototyping without requiring paid satellite API keys or GPU-heavy deep-learning servers.

---

## 🌟 Key Features

### 1. 📊 Disaster Dashboard
* **Hypothetical Disaster Scenarios**:
  * 🌊 **Brahmaputra Basin Monsoon Flash Inundation** (Assam, India - Sentinel-1 SAR & Sentinel-2)
  * 🔥 **Attica Coastal Chaparral Wildfire Front** (Greece - Sentinel-2 SWIR & VIIRS)
  * 🏚️ **Coastal Seismic Structural Failure & Debris** (Aegean Corridor - WorldView-3 VHR & COSMO-SkyMed)
  * 🌊 **Rhine-Meuse Riparian Levee Overspill** (Germany - Sentinel-1 C-Band)
  * 🔥 **Cascade Mountain Complex Conifer Blaze** (Oregon, USA - Landsat-9 OLI-2)
  * 🏚️ **Super Typhoon Wind Shear & Surge Damage** (Manila Bay, Philippines - Sentinel-1 SAR)
* **Multi-Parameter Filtering**: Filter by Hazard Classification (*All, Flood, Wildfire, Urban Damage*), Severity Level (*Critical, High, Moderate*), and Geographic Territory (*Asia-Pacific, Europe, North America*).
* **Live Search**: Instant keyword search across incident titles, locations, and sensor platforms (<kbd>Ctrl + K</kbd>).

### 2. 🔬 Demonstration Analysis Studio & Upload
* **Upload Satellite Imagery**: Drag-and-drop or upload custom satellite imagery (PNG, JPG, simulated multi-spectral composites) for demonstration inference.
* **Spectral Confidence Slider**: Adjust detection sensitivity (0.30 to 0.95) to simulate cloud filtering and anomaly thresholds.
* **Simulated AI Inference Pipeline**: Live telemetry progress animation demonstrating radiometric calibration, spectral index extraction, and geospatial intersection.

### 3. 🗺️ Impact Results & Before/After Mapping
* **Interactive Split-Screen Slider**: Smooth drag-and-touch comparison slider revealing post-disaster damage against pre-disaster baselines.
* **Damage Mask Overlay Toggle**: Switch on/off glowing multi-spectral detection polygons.
* **Geospatial Impact Map**:
  * Canvas-rendered map with Zoom In (+), Zoom Out (-), and Reset (↺) controls.
  * Toggleable layers: Satellite Base Imagery, Inundation/Burn Mask, Critical Infrastructure Pins, and Safe Evacuation Corridors.
  * Interactive marker inspection: Click on any hospital, road, or bridge to open a detailed readiness assessment modal.
* **Critical Infrastructure Table**: Real-time operational statuses for hospitals, bridges, roads, power substations, and shelters.
* **One-Click SITREP Export**: Generates and downloads a formatted `.txt` incident briefing document.

### 4. 📚 Remote Sensing Methodology & Science
* **Normalized Difference Water Index (NDWI)**:
  $$\text{NDWI} = \frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR}}$$
* **Normalized Burn Ratio (NBR) & dNBR**:
  $$\text{NBR} = \frac{\text{NIR} - \text{SWIR}}{\text{NIR} + \text{SWIR}} \quad\Big|\quad \Delta\text{NBR} = \text{NBR}_{\text{pre}} - \text{NBR}_{\text{post}}$$
* **Synthetic Aperture Radar (SAR) Backscatter Drop**:
  $$\Delta\sigma^0 = 10 \cdot \log_{10}\left(\frac{\sigma^0_{\text{post}}}{\sigma^0_{\text{pre}}}\right) \text{ [dB]}$$
* **High-Resolution Morphological Texture Analysis**: Spatial variance and edge disruption for building collapse triage.

### 5. 🎧 Tactical Audio & Aesthetics
* **Web Audio API Synthesizer**: Radar pings, emergency alert chimes, and scan sweep hums (zero external audio files).
* **Orbital Grid Canvas**: Animated satellite ground tracks and radar beam sweeping across the background.

---

## 📁 Project Structure

```
google-anti-gravity/
├── index.html              # Main HTML5 application structure & sections
├── README.md               # Project documentation & run instructions
├── css/
│   ├── style.css           # Global tactical theme, typography, header, ticker
│   └── components.css      # Scenarios grid, slider, impact map, analysis studio
└── js/
    ├── data.js             # Hypothetical disaster datasets, sensor metadata, methodology
    ├── stars.js            # Satellite orbital grid canvas & scanning radar beam
    ├── audio.js            # Web Audio API radar pings & emergency alert synthesizer
    ├── simulator.js        # Synthetic satellite image renderer & image upload processor
    └── app.js              # State controller, slider drag logic, map engine, & filters
```

---

## ⚡ Deploying to Vercel

This repository is pre-configured and 100% ready for instant deployment to **Vercel** with zero manual configuration needed:

* **[`vercel.json`](file:///d:/DOWNLODS/google%20anti%20gravity/vercel.json)**: Production routing, clean URLs, and security headers configured.
* **[`package.json`](file:///d:/DOWNLODS/google%20anti%20gravity/package.json)**: Standard metadata and build scripts recognized by Vercel.
* **[`.vercelignore`](file:///d:/DOWNLODS/google%20anti%20gravity/.vercelignore)**: Keeps the production deployment bundle lean and optimized.
* **[`deploy-to-vercel.bat`](file:///d:/DOWNLODS/google%20anti%20gravity/deploy-to-vercel.bat)**: Double-clickable Windows deployment script.

### Option A: 1-Click Drag-and-Drop Deploy (~30 seconds, No CLI or Git needed)
1. Go to **[vercel.com/new](https://vercel.com/new)** and log in.
2. Drag and drop the project folder directly into the browser window:
   ```text
   d:\DOWNLODS\google anti gravity
   ```
3. Click **Deploy**. Vercel will immediately publish the site and provide your permanent live URL (e.g., `https://terrawatch-disaster-mapping.vercel.app`).

---

### Option B: Double-Click `deploy-to-vercel.bat`
If you have Node.js installed:
1. Double-click the [`deploy-to-vercel.bat`](file:///d:/DOWNLODS/google%20anti%20gravity/deploy-to-vercel.bat) file in this directory.
2. Follow the on-screen prompt to log in and deploy.

---

### Option C: Connect via GitHub
1. Create a repository on [github.com/new](https://github.com/new).
2. Push this directory to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy TerraWatch to Vercel"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
3. On [vercel.com](https://vercel.com), click **Import Project**, select your GitHub repository, and click **Deploy**.

This project is built using modern web standards (**zero build tools, zero npm packages required**).

### Option 1: Direct Browser Launch (Easiest & Fastest)
1. Navigate to the project folder:
   ```text
   d:\DOWNLODS\google anti gravity
   ```
2. Double-click on `index.html` (or right-click $\rightarrow$ **Open with** $\rightarrow$ Google Chrome, Microsoft Edge, or Firefox).
3. The app will launch immediately!

---

### Option 2: Using Python's Built-in HTTP Server (Recommended)
Because Python 3 is installed on your computer:
1. Open PowerShell or Command Prompt.
2. Navigate to the project folder:
   ```powershell
   cd "d:\DOWNLODS\google anti gravity"
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8000
   ```

---

### Option 3: Using VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and choose **"Open with Live Server"**.

---

## 🏆 Hackathon Presentation & Pitch Script

When pitching this project to hackathon judges, follow this 2-minute demonstration flow:

1. **The Problem & Hook (20s)**:
   > *"During major disasters, terrestrial networks fail and roads get submerged. First responders cannot afford to wait days for aerial surveys. We built **TERRAWATCH**—a satellite-based disaster detection and impact mapping dashboard that uses multi-spectral remote sensing and SAR radar to deliver rapid damage triage."*

2. **Dashboard & Filtering (25s)**:
   * Show the active dashboard with flood, wildfire, and urban damage scenarios.
   * Demonstrate filtering by **Hazard Type** (e.g. Flood) and **Severity** (Critical).

3. **Demonstration Analysis Studio & Custom Upload (35s)**:
   * Navigate to the **Analysis Studio**.
   * Show how users can either select a scenario or upload their own satellite image.
   * Click **"Run Multi-Spectral Disaster Inference"** to showcase the animated 4-stage pipeline with tactical audio effects.

4. **Interactive Results & Impact Mapping (30s)**:
   * Demonstrate the **Before & After Split-Screen Slider** by dragging across the flood/wildfire scene.
   * Show the **Interactive Geospatial Impact Map**: toggle the Damage Mask, Evacuation Corridors, and click an infrastructure pin (e.g. *District Medical Center*) to view the readiness popup.
   * Click **"Export Situation Report (SITREP)"** to demonstrate instant civil defense report generation.

5. **Science & Transparency (10s)**:
   * Highlight the **Methodology Section** explaining NDWI, dNBR, and SAR physics, highlighting academic honesty regarding the prototype simulation mode.

---

**Built with pride for the 2026 Space Technology & Disaster Response Hackathon 🛰️**
