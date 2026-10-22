/**
 * TERRAWATCH - Satellite-Based Disaster Detection & Impact Mapping
 * Master Hypothetical Disaster Scenarios & Remote Sensing Data
 * 
 * NOTE: All scenarios, sensor telemetry, and damage estimates in this module
 * are simulated/illustrative demonstrations designed for hackathon prototyping
 * and disaster management UI/UX evaluation.
 */

const TERRA_DATA = {
  // Global Platform Meta
  systemInfo: {
    platformName: "TERRAWATCH AI",
    subTitle: "Satellite-Based Hypothetical Disaster Detection & Impact Mapping",
    constellations: ["Sentinel-1 (SAR C-Band)", "Sentinel-2 (MSI Optical)", "Landsat-9 (OLI-2/TIRS-2)", "WorldView-3 (VHR)"],
    activeSatellites: 18,
    revisitRateHours: 6.5,
    simulatedVersion: "v2.4-Demo",
    disclaimer: "Demonstration & Prototype Mode: All inferences, damage polygons, and impact numbers are illustrative simulations designed for rapid emergency triage evaluation."
  },

  // Hypothetical Disaster Scenarios
  scenarios: [
    {
      id: "flood-brahmaputra",
      title: "Brahmaputra Basin Monsoon Flash Inundation",
      type: "Flood",
      typeIcon: "🌊",
      severity: "Critical",
      severityColor: "#ef4444",
      location: "Assam Valley, Northeast India",
      region: "Asia-Pacific",
      coordinates: "26.2006° N, 92.9376° E",
      detectionDate: "October 18, 2026",
      sensorPlatform: "Sentinel-1 SAR (Dual-Pol C-Band) + Sentinel-2 MSI",
      resolution: "10 meters",
      opticalCloudCover: "82% (Resolved using SAR Cloud Penetration)",
      summary: "Severe monsoon runoff caused catastrophic breach of river levees across 4 agricultural districts. Extensive standing water inundation detected using radar backscatter drop.",
      methodologyUsed: "SAR Amplitude Change Detection (Δσ⁰ < -4.8 dB) & Optical NDWI Thresholding (> 0.28)",
      impact: {
        affectedAreaSqKm: 142.8,
        affectedHectares: 14280,
        displacedPopulationEst: 64500,
        severityBreakdown: {
          criticalInundated: "48%",
          partiallyFlooded: "34%",
          highRiskBuffer: "18%"
        },
        infrastructure: [
          { name: "Tezpur District Medical Center", type: "Hospital", status: "Critical Alert - Water at perimeter", icon: "🏥", severity: "high" },
          { name: "Brahmaputra National Highway 715", type: "Road", status: "42 km Submerged & Impassable", icon: "🛣️", severity: "critical" },
          { name: "Silghat Electrical Substation B", type: "Power", status: "Emergency De-energized", icon: "⚡", severity: "critical" },
          { name: "Kolong River Suspension Bridge", type: "Bridge", status: "Scour Risk - Closed to traffic", icon: "🌉", severity: "high" },
          { name: "Kaliabor Higher Secondary School", type: "Shelter", status: "Designated Relief Evacuation Site", icon: "🏕️", severity: "safe" }
        ],
        emergencyActions: [
          "Deploy amphibious rescue boats along Highway 715 cut-off corridor",
          "Deliver portable water purification to Kaliabor relief camp",
          "Reinforce levee breach at sector G-4 with bulk sandbagging"
        ]
      },
      mapConfig: {
        center: [26.2, 92.94],
        zoom: 12,
        primaryFeature: "Inundation Polygons & Levee Breach"
      },
      beforeImg: "flood_before",
      afterImg: "flood_after",
      waterMaskColor: "rgba(56, 189, 248, 0.65)"
    },

    {
      id: "wildfire-attica",
      title: "Attica Coastal Chaparral Wildfire Front",
      type: "Wildfire",
      typeIcon: "🔥",
      severity: "Critical",
      severityColor: "#ef4444",
      location: "Attica Peninsula & Penteli Foothills, Greece",
      region: "Europe",
      coordinates: "38.1250° N, 23.8900° E",
      detectionDate: "October 14, 2026",
      sensorPlatform: "Sentinel-2 MSI (Bands 8A NIR, 11/12 SWIR) + VIIRS Active Fires",
      resolution: "20 meters",
      opticalCloudCover: "4% (Heavy Pyrocumulus Smoke Plume)",
      summary: "Gale-force dry Meltemi winds fueled a catastrophic wildland-urban interface firestorm. Shortwave infrared bands mapped active fire fronts and high-severity ash burn scars.",
      methodologyUsed: "Delta Normalized Burn Ratio (dNBR = NBR_pre - NBR_post) with dNBR > 0.66 High Burn Severity Cutoff",
      impact: {
        affectedAreaSqKm: 89.6,
        affectedHectares: 8960,
        displacedPopulationEst: 31200,
        severityBreakdown: {
          criticalBurnScar: "52%",
          activeFirePerimeter: "22%",
          smokeHazardZone: "26%"
        },
        infrastructure: [
          { name: "Penteli Pediatric Health Facility", type: "Hospital", status: "Evacuated / Defended with retardant", icon: "🏥", severity: "high" },
          { name: "Attiki Odos Highway Exit 12-16", type: "Road", status: "Zero Visibility Smoke Closure (28 km)", icon: "🛣️", severity: "critical" },
          { name: "Varnavas 150kV High-Voltage Pylon Corridor", type: "Power", status: "Tripped - Line Down", icon: "⚡", severity: "critical" },
          { name: "Marathon Water Reservoir Pumping Stn", type: "Water", status: "Operational on Standby Generator", icon: "💧", severity: "moderate" },
          { name: "Nea Makri Municipal Stadium", type: "Shelter", status: "Primary Assembly & Triage Post", icon: "🏕️", severity: "safe" }
        ],
        emergencyActions: [
          "Establish aerial water drop perimeter along Southern Penteli Ridge",
          "Issue immediate cell broadcast evacuation for Sector 3 residents",
          "Distribute N95/P100 particulate masks due to PM2.5 > 380 µg/m³"
        ]
      },
      mapConfig: {
        center: [38.125, 23.89],
        zoom: 12,
        primaryFeature: "Burn Scar Perimeter & Active Flank"
      },
      beforeImg: "fire_before",
      afterImg: "fire_after",
      waterMaskColor: "rgba(239, 68, 68, 0.65)"
    },

    {
      id: "urban-aegean",
      title: "Coastal Seismic Structural Collapse & Debris Mapping",
      type: "Urban Damage",
      typeIcon: "🏚️",
      severity: "Critical",
      severityColor: "#ef4444",
      location: "Izmir-Samos Coastal Corridor, Aegean",
      region: "Europe",
      coordinates: "37.8920° N, 27.2600° E",
      detectionDate: "October 11, 2026",
      sensorPlatform: "WorldView-3 VHR Optical (0.3m) + COSMO-SkyMed InSAR",
      resolution: "0.5 meters",
      opticalCloudCover: "2% Clear Sky",
      summary: "Hypothetical Magnitude 6.9 shallow earthquake caused extensive pancaking of soft-story residential buildings and quay wall lateral spreading along port facilities.",
      methodologyUsed: "High-Resolution Morphological Feature Texture Contrast & Pre/Post Co-registered InSAR Coherence Loss",
      impact: {
        affectedAreaSqKm: 18.2,
        affectedHectares: 1820,
        displacedPopulationEst: 42000,
        severityBreakdown: {
          collapsedStructures: "38%",
          severeStructuralDamage: "36%",
          debrisObstructedStreets: "26%"
        },
        infrastructure: [
          { name: "Bayrakli District Trauma Center", type: "Hospital", status: "Structural Damage to Annex - Triage in Courtyard", icon: "🏥", severity: "critical" },
          { name: "Coastal Pier 4 Port Cranes & Quayside", type: "Port", status: "Liquefaction Failure - Navigational Warning", icon: "⚓", severity: "critical" },
          { name: "Manas Boulevard Arterial", type: "Road", status: "18 Blocked Intersections / Debris", icon: "🛣️", severity: "critical" },
          { name: "Alsancak Gas Distribution Main", type: "Gas", status: "Automatic Seismic Shutoff Triggered", icon: "⚠️", severity: "high" },
          { name: "Ataturk Sports Arena Complex", type: "Shelter", status: "Search & Rescue Staging Base Camp", icon: "🏕️", severity: "safe" }
        ],
        emergencyActions: [
          "Deploy USAR (Urban Search & Rescue) squads to Sectors B1 and C4",
          "Clear heavy debris from Manas Boulevard to re-open emergency ambulance route",
          "Conduct emergency structural safety tagging (Red/Yellow/Green inspection)"
        ]
      },
      mapConfig: {
        center: [37.892, 27.26],
        zoom: 14,
        primaryFeature: "Building Damage Polygons & Debris Obstructions"
      },
      beforeImg: "urban_before",
      afterImg: "urban_after",
      waterMaskColor: "rgba(245, 158, 11, 0.65)"
    },

    {
      id: "flood-rhine",
      title: "Rhine-Meuse Riparian Levee Overspill",
      type: "Flood",
      typeIcon: "🌊",
      severity: "High",
      severityColor: "#f97316",
      location: "Ahrweiler Valley & Middle Rhine, Germany",
      region: "Europe",
      coordinates: "50.5430° N, 7.1250° E",
      detectionDate: "October 06, 2026",
      sensorPlatform: "Sentinel-1 SAR C-Band (IW Mode)",
      resolution: "10 meters",
      opticalCloudCover: "95% (Fully penetrated by microwave SAR)",
      summary: "Prolonged atmospheric river generated intense 48-hour precipitation, causing sudden valley flash flooding and inundation of riparian townships.",
      methodologyUsed: "Multi-Temporal SAR Water Delineation & High-Resolution Digital Elevation Model (DEM) Hydro-Enforcement",
      impact: {
        affectedAreaSqKm: 58.4,
        affectedHectares: 5840,
        displacedPopulationEst: 18200,
        severityBreakdown: {
          criticalInundated: "42%",
          riparianFlooding: "38%",
          mudslideRunoff: "20%"
        },
        infrastructure: [
          { name: "Bad Neuenahr Community Clinic", type: "Hospital", status: "Basement Submerged - Patients Moved to Floor 2", icon: "🏥", severity: "high" },
          { name: "Federal Highway B267", type: "Road", status: "Tarmac Washout at Mile 14", icon: "🛣️", severity: "critical" },
          { name: "Ahrtalbahn Rail Bridge", type: "Rail", status: "Structural Damage - Service Suspended", icon: "🚆", severity: "critical" },
          { name: "Grafschaft Sports Ground", type: "Shelter", status: "Helicopter Evacuation Landing Pad Active", icon: "🏕️", severity: "safe" }
        ],
        emergencyActions: [
          "Position emergency mobile pumps at Bad Neuenahr Clinic",
          "Mobilize federal engineer corps for modular Bailey bridge construction",
          "Issue river level crest warning for downstream confluence"
        ]
      },
      mapConfig: {
        center: [50.543, 7.125],
        zoom: 13,
        primaryFeature: "Riparian Inundation & Rail Disruption"
      },
      beforeImg: "flood_before",
      afterImg: "flood_after",
      waterMaskColor: "rgba(56, 189, 248, 0.65)"
    },

    {
      id: "wildfire-cascades",
      title: "Cascade Mountain Complex Conifer Blaze",
      type: "Wildfire",
      typeIcon: "🔥",
      severity: "High",
      severityColor: "#f97316",
      location: "Willamette National Forest, Oregon, USA",
      region: "North America",
      coordinates: "44.1500° N, 121.7800° W",
      detectionDate: "September 28, 2026",
      sensorPlatform: "Landsat-9 OLI-2 + Sentinel-2 MSI",
      resolution: "30 meters",
      opticalCloudCover: "12% Smoke Dispersion",
      summary: "Dry thunderstorm lightning cluster ignited multi-point wildfires across steep timber terrain, generating rapid crown fire spreads.",
      methodologyUsed: "NBR & NDVI Differential Anomaly Detection with Thermal Anomaly Radiance Corroboration",
      impact: {
        affectedAreaSqKm: 112.5,
        affectedHectares: 11250,
        displacedPopulationEst: 9800,
        severityBreakdown: {
          highCanopyBurn: "45%",
          moderateBurn: "35%",
          unburnedEnclave: "20%"
        },
        infrastructure: [
          { name: "McKenzie Pass Scenic Highway 242", type: "Road", status: "Indefinitely Closed due to Fallen Timber", icon: "🛣️", severity: "critical" },
          { name: "Cougar Dam Hydroelectric Facility", type: "Power", status: "Hardened Perimeter - Running Reduced Output", icon: "⚡", severity: "moderate" },
          { name: "Sisters High School Relief Center", type: "Shelter", status: "Accommodating 420 Evacuees & Livestock", icon: "🏕️", severity: "safe" }
        ],
        emergencyActions: [
          "Bulldoze containment line on western perimeter of Sisters township",
          "Deploy drone night-vision thermal sweeps to locate spot fires",
          "Enforce mandatory river corridor evacuation"
        ]
      },
      mapConfig: {
        center: [44.15, -121.78],
        zoom: 12,
        primaryFeature: "Crown Fire Front & Timber Burn Scar"
      },
      beforeImg: "fire_before",
      afterImg: "fire_after",
      waterMaskColor: "rgba(239, 68, 68, 0.65)"
    },

    {
      id: "urban-typhoon",
      title: "Super Typhoon Wind Shear & Storm Surge Damage",
      type: "Urban Damage",
      typeIcon: "🏚️",
      severity: "Moderate",
      severityColor: "#eab308",
      location: "Manila Bay Embankment & Navotas, Philippines",
      region: "Asia-Pacific",
      coordinates: "14.5995° N, 120.9842° E",
      detectionDate: "September 19, 2026",
      sensorPlatform: "Sentinel-1 SAR + PlanetScope VHR Optical (3m)",
      resolution: "3 meters",
      opticalCloudCover: "68% Heavy Cumulonimbus",
      summary: "Category 5 typhoon generated 3.8-meter storm surge, inundating low-lying coastal squatter settlements and peeling industrial corrugated roofs.",
      methodologyUsed: "Dual-Polarization SAR Depolarization (VH/VV Ratio Change) & Optical High-Frequency Wavelet Texture Analysis",
      impact: {
        affectedAreaSqKm: 34.6,
        affectedHectares: 3460,
        displacedPopulationEst: 27500,
        severityBreakdown: {
          coastalInundation: "50%",
          roofShearDamage: "30%",
          structuralIntact: "20%"
        },
        infrastructure: [
          { name: "Tondo District General Hospital", type: "Hospital", status: "Floodwaters in parking bay; wards operational", icon: "🏥", severity: "moderate" },
          { name: "Roxas Boulevard Coastal Highway", type: "Road", status: "Debris & Sea Mud Deposits - 12 km closed", icon: "🛣️", severity: "high" },
          { name: "North Harbor International Port", type: "Port", status: "Container Yard Stack Collapse (40 TEUs)", icon: "⚓", severity: "high" },
          { name: "Delpan Sports Complex", type: "Shelter", status: "Serving 2,100 families", icon: "🏕️", severity: "safe" }
        ],
        emergencyActions: [
          "Clear mud and marine debris from Roxas Boulevard using heavy bulldozers",
          "Inspect container stacks at North Harbor for hazardous chemical leaks",
          "Distribute emergency food rations and water purification tablets"
        ]
      },
      mapConfig: {
        center: [14.6, 120.98],
        zoom: 13,
        primaryFeature: "Storm Surge Inundation & Industrial Damage"
      },
      beforeImg: "urban_before",
      afterImg: "urban_after",
      waterMaskColor: "rgba(245, 158, 11, 0.65)"
    }
  ],

  // Methodology & Remote Sensing Reference Data
  methodology: [
    {
      title: "Normalized Difference Water Index (NDWI)",
      category: "Optical Multi-Spectral Index",
      badge: "Flood Delineation",
      formula: "NDWI = (Green - NIR) / (Green + NIR)",
      sensor: "Sentinel-2 Bands B03 (Green) & B08 (NIR)",
      explanation: "Water bodies reflect green light strongly while virtually absorbing all near-infrared radiation. Pure water yields positive values (NDWI > 0.2), enabling crisp differentiation between open standing floodwaters and terrestrial soil or vegetation.",
      accuracyNote: "Optical index requires cloud-free imagery. In persistent storm systems, Synthetic Aperture Radar (SAR) is required as a primary or fused data source."
    },
    {
      title: "Normalized Burn Ratio (NBR) & Delta NBR (dNBR)",
      category: "Optical Thermal/Infrared Index",
      badge: "Wildfire Severity",
      formula: "NBR = (NIR - SWIR) / (NIR + SWIR) | dNBR = NBR_pre - NBR_post",
      sensor: "Sentinel-2 B08 (NIR) & B12 (Short-Wave Infrared 2.2 µm)",
      explanation: "Healthy, moist vegetation displays high near-infrared reflectance and low shortwave infrared absorption. In contrast, burned soil and charcoal absorb NIR and radiate SWIR intensely. Subtracting post-fire NBR from pre-fire NBR produces dNBR, categorizing burn severity from Unburned (< 0.1) to High Severity (> 0.66).",
      accuracyNote: "Standardized metric validated by USGS and European Forest Fire Information System (EFFIS)."
    },
    {
      title: "Synthetic Aperture Radar (SAR) Backscatter Anomaly",
      category: "Active Microwave Remote Sensing",
      badge: "All-Weather Day/Night",
      formula: "Δσ⁰ = 10 * log10( σ⁰_post / σ⁰_pre ) [dB]",
      sensor: "Sentinel-1 C-Band SAR (5.405 GHz, VV & VH Polarizations)",
      explanation: "Active radar emits microwave pulses that penetrate clouds, volcanic smoke, and night darkness. Calm, smooth standing water behaves as a specular reflector, bouncing radar pulses away from the antenna and creating a drastic drop in backscatter intensity (dark pixels in radar imagery).",
      accuracyNote: "Essential for monsoon and hurricane disaster response where optical clouds persist for weeks."
    },
    {
      title: "High-Resolution Morphological Texture Analysis",
      category: "Computer Vision & Photogrammetry",
      badge: "Urban Collapse & Debris",
      formula: "GLCM Texture Variance + Multi-Scale Feature Correlation",
      sensor: "Very High Resolution Satellites (WorldView-3, Pleiades Neo, Skysat)",
      explanation: "Urban building collapse alters regular geometric rooflines, shadows, and facade textures into chaotic debris mounds. By computing local Gray-Level Co-occurrence Matrix (GLCM) entropy and edge discontinuity maps between co-registered pre- and post-event images, collapsed structures are rapidly flagged.",
      accuracyNote: "Sub-meter pixel resolution (0.3m to 0.5m) is typically required to assess individual building structural integrity."
    }
  ],

  // Live Earth Observation Satellite Telemetry (Simulated)
  liveSatellites: [
    { name: "Sentinel-1A", sensor: "C-SAR (Radar)", alt: "693 km", velocity: "7.52 km/s", status: "Acquiring (IW Mode)", target: "Brahmaputra Valley" },
    { name: "Sentinel-2B", sensor: "MSI (13 Bands Optical)", alt: "786 km", velocity: "7.48 km/s", status: "Sun-Synchronous Orbit", target: "Mediterranean Basin" },
    { name: "Landsat-9", sensor: "OLI-2 / TIRS-2", alt: "705 km", velocity: "7.50 km/s", status: "Thermal Mapping", target: "Pacific Northwest" },
    { name: "WorldView-3", sensor: "VHR Optical (0.31m)", alt: "617 km", velocity: "7.55 km/s", status: "Tasked Emergency Pass", target: "Izmir Coastal Sector" }
  ]
};

// Make accessible to all modules
if (typeof window !== "undefined") {
  window.TERRA_DATA = TERRA_DATA;
}
