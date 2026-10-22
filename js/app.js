/**
 * TERRAWATCH - Main Application Logic & UI Controller
 * Satellite-Based Disaster Detection & Impact Mapping Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Global Application State ---
  const state = {
    currentSection: 'dashboard',
    selectedTypeFilter: 'all',
    selectedSeverityFilter: 'all',
    selectedRegionFilter: 'all',
    searchQuery: '',
    currentScenario: TERRA_DATA.scenarios[0], // Default: Brahmaputra Flood
    uploadedAnalysisResult: null,
    isDamageMaskActive: true,
    sliderPos: 50,
    isDraggingSlider: false,
    mapZoom: 1.0,
    activeMapLayers: {
      satellite: true,
      damageMask: true,
      infrastructure: true,
      evacuation: true,
      heatmap: false
    },
    simulator: new window.SatelliteSimulator()
  };

  // --- Element Selectors ---
  const el = {
    // Nav
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.content-section'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileDrawer: document.getElementById('mobileDrawer'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),

    // Dashboard
    scenariosGrid: document.getElementById('scenariosGrid'),
    searchInput: document.getElementById('searchInput'),
    typeFilterGroup: document.getElementById('typeFilterGroup'),
    severityFilterGroup: document.getElementById('severityFilterGroup'),
    regionSelect: document.getElementById('regionSelect'),
    statTotalIncidents: document.getElementById('statTotalIncidents'),
    statTotalArea: document.getElementById('statTotalArea'),
    statTotalDisplaced: document.getElementById('statTotalDisplaced'),

    // Analysis Studio
    analysisPresetSelect: document.getElementById('analysisPresetSelect'),
    fileDropZone: document.getElementById('fileDropZone'),
    satelliteFileInput: document.getElementById('satelliteFileInput'),
    uploadPreviewBox: document.getElementById('uploadPreviewBox'),
    uploadPreviewImg: document.getElementById('uploadPreviewImg'),
    uploadFileInfo: document.getElementById('uploadFileInfo'),
    uploadTypeSelect: document.getElementById('uploadTypeSelect'),
    thresholdSlider: document.getElementById('thresholdSlider'),
    thresholdVal: document.getElementById('thresholdVal'),
    runAnalysisBtn: document.getElementById('runAnalysisBtn'),
    analysisPipelineCard: document.getElementById('analysisPipelineCard'),
    pipelineStatusText: document.getElementById('pipelineStatusText'),
    pipelineProgressBar: document.getElementById('pipelineProgressBar'),

    // Results & Before/After
    resultsTitle: document.getElementById('resultsTitle'),
    resultsLocation: document.getElementById('resultsLocation'),
    resultsSensor: document.getElementById('resultsSensor'),
    resultsMethod: document.getElementById('resultsMethod'),
    resultsAreaSqKm: document.getElementById('resultsAreaSqKm'),
    resultsDisplaced: document.getElementById('resultsDisplaced'),
    resultsHectares: document.getElementById('resultsHectares'),
    sliderContainer: document.getElementById('sliderContainer'),
    sliderDivider: document.getElementById('sliderDivider'),
    sliderBeforeCanvas: document.getElementById('sliderBeforeCanvas'),
    sliderAfterCanvas: document.getElementById('sliderAfterCanvas'),
    afterLayerWrap: document.getElementById('afterLayerWrap'),
    toggleMaskBtn: document.getElementById('toggleMaskBtn'),
    sliderPctLabel: document.getElementById('sliderPctLabel'),

    // Map
    impactMapCanvas: document.getElementById('impactMapCanvas'),
    mapZoomInBtn: document.getElementById('mapZoomInBtn'),
    mapZoomOutBtn: document.getElementById('mapZoomOutBtn'),
    mapZoomResetBtn: document.getElementById('mapZoomResetBtn'),
    layerToggleCheckboxes: document.querySelectorAll('.layer-checkbox'),
    infrastructureTableBody: document.getElementById('infrastructureTableBody'),
    emergencyActionsList: document.getElementById('emergencyActionsList'),
    exportSitrepBtn: document.getElementById('exportSitrepBtn'),

    // Methodology
    methodologyCardsGrid: document.getElementById('methodologyCardsGrid'),

    // Modals
    infraModal: document.getElementById('infraModal'),
    infraModalBody: document.getElementById('infraModalBody'),
    closeInfraModalBtn: document.getElementById('closeInfraModalBtn')
  };

  // --- Audio Helpers ---
  function playClick() {
    if (window.terraAudio) window.terraAudio.playClick();
  }
  function playAlert() {
    if (window.terraAudio) window.terraAudio.playEmergencyAlert();
  }
  function playSuccess() {
    if (window.terraAudio) window.terraAudio.playSuccess();
  }
  function playRadar() {
    if (window.terraAudio) window.terraAudio.playRadarPing();
  }

  // ==========================================
  // NAVIGATION CONTROLLER
  // ==========================================
  function switchSection(sectionId, updateHash = true) {
    playClick();
    state.currentSection = sectionId;

    el.navLinks.forEach(link => {
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    el.sections.forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.remove('hidden');
        sec.classList.add('active-section');
      } else {
        sec.classList.add('hidden');
        sec.classList.remove('active-section');
      }
    });

    if (el.mobileDrawer) el.mobileDrawer.classList.remove('open');
    if (updateHash) window.location.hash = sectionId;

    // Refresh rendering when entering Results
    if (sectionId === 'results') {
      setTimeout(() => {
        renderComparisonSlider();
        renderImpactMap();
      }, 50);
    }
  }

  el.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.dataset.section;
      if (sec) switchSection(sec);
    });
  });

  if (el.mobileMenuBtn && el.mobileDrawer) {
    el.mobileMenuBtn.addEventListener('click', () => {
      playClick();
      el.mobileDrawer.classList.toggle('open');
    });
  }

  // URL Hash Router
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      switchSection(hash, false);
    } else {
      switchSection('dashboard', false);
    }
  }

  // ==========================================
  // AUDIO TOGGLE
  // ==========================================
  if (el.soundToggleBtn) {
    const isMuted = localStorage.getItem('terra_sound_muted') === 'true';
    updateSoundBtnState(isMuted);

    el.soundToggleBtn.addEventListener('click', () => {
      if (window.terraAudio) {
        const muted = window.terraAudio.toggleMute();
        updateSoundBtnState(muted);
        if (!muted) window.terraAudio.playRadarPing();
      }
    });
  }

  function updateSoundBtnState(muted) {
    if (!el.soundToggleBtn) return;
    el.soundToggleBtn.innerHTML = muted
      ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/></svg><span>SFX Muted</span>`
      : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg><span>SFX Active</span>`;
  }

  // ==========================================
  // DASHBOARD CONTROLLER & METRICS
  // ==========================================
  function updateDashboardSummaryMetrics() {
    const totalArea = TERRA_DATA.scenarios.reduce((acc, s) => acc + s.impact.affectedAreaSqKm, 0);
    const totalPop = TERRA_DATA.scenarios.reduce((acc, s) => acc + s.impact.displacedPopulationEst, 0);

    if (el.statTotalIncidents) el.statTotalIncidents.textContent = TERRA_DATA.scenarios.length;
    if (el.statTotalArea) el.statTotalArea.textContent = `${totalArea.toFixed(1)} km²`;
    if (el.statTotalDisplaced) el.statTotalDisplaced.textContent = `~${totalPop.toLocaleString()}`;
  }

  function renderDashboardFilters() {
    // Type Filters
    if (el.typeFilterGroup) {
      const types = ['all', 'Flood', 'Wildfire', 'Urban Damage'];
      el.typeFilterGroup.innerHTML = types.map(t => `
        <button class="filter-pill ${state.selectedTypeFilter === t ? 'active' : ''}" data-type="${t}">
          ${t === 'all' ? 'All Hazard Types' : t}
        </button>
      `).join('');

      el.typeFilterGroup.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          playClick();
          state.selectedTypeFilter = btn.dataset.type;
          renderDashboardFilters();
          renderScenarioCards();
        });
      });
    }

    // Severity Filters
    if (el.severityFilterGroup) {
      const sevs = ['all', 'Critical', 'High', 'Moderate'];
      el.severityFilterGroup.innerHTML = sevs.map(s => `
        <button class="filter-pill ${state.selectedSeverityFilter === s ? 'active' : ''}" data-sev="${s}">
          ${s === 'all' ? 'All Severities' : s}
        </button>
      `).join('');

      el.severityFilterGroup.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          playClick();
          state.selectedSeverityFilter = btn.dataset.sev;
          renderDashboardFilters();
          renderScenarioCards();
        });
      });
    }
  }

  function renderScenarioCards() {
    if (!el.scenariosGrid) return;

    const filtered = TERRA_DATA.scenarios.filter(item => {
      const q = state.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.sensorPlatform.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      const matchesType = state.selectedTypeFilter === 'all' || item.type === state.selectedTypeFilter;
      const matchesSev = state.selectedSeverityFilter === 'all' || item.severity === state.selectedSeverityFilter;
      const matchesRegion = state.selectedRegionFilter === 'all' || item.region === state.selectedRegionFilter;

      return matchesSearch && matchesType && matchesSev && matchesRegion;
    });

    if (filtered.length === 0) {
      el.scenariosGrid.innerHTML = `
        <div class="empty-state-box glass-card">
          <div class="empty-icon">🛰️</div>
          <h3>No matching disaster scenarios found</h3>
          <p>Try resetting your search query or hazard filters to view all monitored zones.</p>
        </div>
      `;
      return;
    }

    el.scenariosGrid.innerHTML = filtered.map(sc => `
      <article class="scenario-card glass-card" data-id="${sc.id}">
        <div class="scenario-card-header">
          <div class="type-badge-group">
            <span class="hazard-type-badge">${sc.typeIcon} ${sc.type.toUpperCase()}</span>
            <span class="severity-badge sev-${sc.severity.toLowerCase()}">
              <span class="sev-dot"></span>${sc.severity}
            </span>
          </div>
          <span class="coord-tag">${sc.coordinates.split(',')[0]}</span>
        </div>

        <h3 class="scenario-title">${sc.title}</h3>
        <p class="scenario-location">📍 ${sc.location}</p>
        <p class="scenario-summary">${sc.summary}</p>

        <div class="scenario-telemetry-box">
          <div class="t-cell">
            <span class="t-label">Estimated Area</span>
            <span class="t-val">${sc.impact.affectedAreaSqKm} km²</span>
          </div>
          <div class="t-cell">
            <span class="t-label">Population Risk</span>
            <span class="t-val">~${sc.impact.displacedPopulationEst.toLocaleString()}</span>
          </div>
          <div class="t-cell">
            <span class="t-label">Satellite Platform</span>
            <span class="t-val">${sc.sensorPlatform.split('+')[0]}</span>
          </div>
        </div>

        <div class="scenario-card-footer">
          <button class="btn btn-outline-cyan btn-sm inspect-scenario-btn" data-id="${sc.id}">
            Inspect Telemetry & Impact Map &rarr;
          </button>
        </div>
      </article>
    `).join('');

    el.scenariosGrid.querySelectorAll('.inspect-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const found = TERRA_DATA.scenarios.find(s => s.id === btn.dataset.id);
        if (found) {
          state.currentScenario = found;
          state.uploadedAnalysisResult = null;
          updateResultsPanel(found);
          switchSection('results');
        }
      });
    });
  }

  // Dashboard Search & Region Handlers
  if (el.searchInput) {
    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderScenarioCards();
    });
  }

  if (el.regionSelect) {
    el.regionSelect.addEventListener('change', (e) => {
      state.selectedRegionFilter = e.target.value;
      renderScenarioCards();
    });
  }

  // ==========================================
  // ANALYSIS STUDIO: UPLOAD & INFERENCE PIPELINE
  // ==========================================
  function populateAnalysisPresets() {
    if (!el.analysisPresetSelect) return;
    el.analysisPresetSelect.innerHTML = `
      <option value="">-- Choose a Pre-Loaded Disaster Scenario --</option>
      ${TERRA_DATA.scenarios.map(s => `
        <option value="${s.id}">${s.typeIcon} ${s.title} (${s.type} - ${s.location})</option>
      `).join('')}
    `;

    el.analysisPresetSelect.addEventListener('change', (e) => {
      const selected = TERRA_DATA.scenarios.find(s => s.id === e.target.value);
      if (selected) {
        state.currentScenario = selected;
        state.uploadedAnalysisResult = null;
        if (el.uploadPreviewBox) el.uploadPreviewBox.classList.add('hidden');
      }
    });
  }

  if (el.thresholdSlider && el.thresholdVal) {
    el.thresholdSlider.addEventListener('input', (e) => {
      el.thresholdVal.textContent = e.target.value;
    });
  }

  // Drag and Drop & Upload Handling
  if (el.fileDropZone && el.satelliteFileInput) {
    el.fileDropZone.addEventListener('click', () => {
      el.satelliteFileInput.click();
    });

    el.fileDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.fileDropZone.classList.add('drag-active');
    });

    el.fileDropZone.addEventListener('dragleave', () => {
      el.fileDropZone.classList.remove('drag-active');
    });

    el.fileDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      el.fileDropZone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    el.satelliteFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    playClick();
    const hazardType = el.uploadTypeSelect ? el.uploadTypeSelect.value : 'Flood';

    if (el.uploadFileInfo) {
      el.uploadFileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB) • Multi-spectral Format`;
    }

    // Read and show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (el.uploadPreviewImg) el.uploadPreviewImg.src = e.target.result;
      if (el.uploadPreviewBox) el.uploadPreviewBox.classList.remove('hidden');
      state.customUploadedFile = file;
    };
    reader.readAsDataURL(file);
  }

  // Trigger Simulated AI Analysis Pipeline
  if (el.runAnalysisBtn) {
    el.runAnalysisBtn.addEventListener('click', async () => {
      playRadar();
      if (window.terraAudio) window.terraAudio.startScanHum();

      if (el.analysisPipelineCard) {
        el.analysisPipelineCard.classList.remove('hidden');
        el.analysisPipelineCard.scrollIntoView({ behavior: 'smooth' });
      }

      el.runAnalysisBtn.disabled = true;

      const steps = [
        { pct: 20, text: "Calibrating Multi-Spectral Radiance & Georeferencing..." },
        { pct: 45, text: "Computing Normalized Difference Indices (NDWI / dNBR / SAR Δσ⁰)..." },
        { pct: 70, text: "Executing Threshold Segmentation & Cloud Anomaly Masking..." },
        { pct: 90, text: "Intersecting Geospatial Infrastructure & Calculating Impact Polygons..." },
        { pct: 100, text: "Inference Complete. Generating Disaster Situation Report..." }
      ];

      for (const step of steps) {
        if (el.pipelineProgressBar) el.pipelineProgressBar.style.width = `${step.pct}%`;
        if (el.pipelineStatusText) el.pipelineStatusText.textContent = step.text;
        await new Promise(r => setTimeout(r, 650));
      }

      if (window.terraAudio) window.terraAudio.stopScanHum();
      playSuccess();
      playAlert();

      // If user uploaded a custom image, process it through simulator
      if (state.customUploadedFile) {
        const hazardType = el.uploadTypeSelect ? el.uploadTypeSelect.value : 'Flood';
        const customRes = await state.simulator.processUserUploadedImage(state.customUploadedFile, hazardType);
        state.uploadedAnalysisResult = customRes;

        // Create a custom scenario entry for Results
        state.currentScenario = {
          id: "custom-upload",
          title: `Custom Satellite Analysis: ${state.customUploadedFile.name}`,
          type: hazardType,
          typeIcon: hazardType === 'Flood' ? '🌊' : hazardType === 'Wildfire' ? '🔥' : '🏚️',
          severity: "Critical",
          severityColor: "#ef4444",
          location: "Uploaded Scene Geo-Coordinates (Custom User Dataset)",
          region: "Custom",
          coordinates: "34.0522° N, 118.2437° W (Illustrative)",
          detectionDate: "Live Analysis " + new Date().toLocaleDateString(),
          sensorPlatform: "User Uploaded Multi-Spectral Scene (Sentinel / Landsat Resolution)",
          resolution: "Simulated 10m Ground Sample Distance",
          opticalCloudCover: "< 10% (Verified)",
          summary: `Demonstration AI inference segmented ${customRes.affectedAreaSqKm} km² of detected ${hazardType.toLowerCase()} anomalies across the user-provided satellite scene.`,
          methodologyUsed: `Simulated Band Extraction & Adaptive Otsu Thresholding (${hazardType === 'Flood' ? 'NDWI' : hazardType === 'Wildfire' ? 'dNBR' : 'Texture Discontinuity'})`,
          impact: {
            affectedAreaSqKm: parseFloat(customRes.affectedAreaSqKm),
            affectedHectares: Math.round(parseFloat(customRes.affectedAreaSqKm) * 100),
            displacedPopulationEst: customRes.displacedEst,
            severityBreakdown: {
              criticalInundated: "48%",
              partiallyFlooded: "32%",
              highRiskBuffer: "20%"
            },
            infrastructure: [
              { name: "Central Emergency Facility Alpha", type: "Hospital", status: "Critical Access Path Submerged", icon: "🏥", severity: "critical" },
              { name: "Sector Primary Transport Artery", type: "Road", status: "18 km Disrupted / Impassable", icon: "🛣️", severity: "critical" },
              { name: "Regional Power Distribution Hub", type: "Power", status: "Operating on Aux Battery", icon: "⚡", severity: "high" },
              { name: "Designated Relief Community Shelter", type: "Shelter", status: "Active Triage Post", icon: "🏕️", severity: "safe" }
            ],
            emergencyActions: [
              "Deploy emergency response assets along primary access corridors",
              "Maintain continuous multi-spectral satellite surveillance passes",
              "Distribute emergency civil defense advisory"
            ]
          },
          mapConfig: {
            center: [34.05, -118.24],
            zoom: 13,
            primaryFeature: "User Scene Segmentation"
          }
        };
      }

      el.runAnalysisBtn.disabled = false;
      updateResultsPanel(state.currentScenario);
      switchSection('results');
    });
  }

  // ==========================================
  // RESULTS & BEFORE/AFTER SLIDER CONTROLLER
  // ==========================================
  function updateResultsPanel(sc) {
    if (!sc) return;

    if (el.resultsTitle) el.resultsTitle.textContent = sc.title;
    if (el.resultsLocation) el.resultsLocation.textContent = `📍 ${sc.location} (${sc.coordinates})`;
    if (el.resultsSensor) el.resultsSensor.textContent = sc.sensorPlatform;
    if (el.resultsMethod) el.resultsMethod.textContent = sc.methodologyUsed;
    if (el.resultsAreaSqKm) el.resultsAreaSqKm.textContent = `${sc.impact.affectedAreaSqKm} km²`;
    if (el.resultsHectares) el.resultsHectares.textContent = `${sc.impact.affectedHectares.toLocaleString()} ha`;
    if (el.resultsDisplaced) el.resultsDisplaced.textContent = `~${sc.impact.displacedPopulationEst.toLocaleString()}`;

    // Render Infrastructure Table
    if (el.infrastructureTableBody) {
      el.infrastructureTableBody.innerHTML = sc.impact.infrastructure.map(item => `
        <tr class="infra-row" data-name="${item.name}">
          <td><span class="infra-type-icon">${item.icon}</span> <strong>${item.name}</strong></td>
          <td><span class="tag-pill">${item.type}</span></td>
          <td><span class="status-cell ${item.severity === 'critical' ? 'text-red' : item.severity === 'high' ? 'text-orange' : 'text-green'}">${item.status}</span></td>
          <td><button class="btn btn-outline-cyan btn-sm inspect-infra-btn" data-name="${item.name}" data-status="${item.status}" data-type="${item.type}">Inspect</button></td>
        </tr>
      `).join('');

      el.infrastructureTableBody.querySelectorAll('.inspect-infra-btn').forEach(b => {
        b.addEventListener('click', () => {
          openInfraModal(b.dataset.name, b.dataset.type, b.dataset.status);
        });
      });
    }

    // Render Recommended Emergency Actions
    if (el.emergencyActionsList) {
      el.emergencyActionsList.innerHTML = sc.impact.emergencyActions.map(act => `
        <li class="action-item">
          <span class="action-check">✔</span>
          <span>${act}</span>
        </li>
      `).join('');
    }

    renderComparisonSlider();
    renderImpactMap();
  }

  function renderComparisonSlider() {
    if (!el.sliderBeforeCanvas || !el.sliderAfterCanvas) return;

    const sc = state.currentScenario;
    const canvasW = el.sliderContainer ? el.sliderContainer.clientWidth : 700;
    const canvasH = 420;

    el.sliderBeforeCanvas.width = canvasW;
    el.sliderBeforeCanvas.height = canvasH;
    el.sliderAfterCanvas.width = canvasW;
    el.sliderAfterCanvas.height = canvasH;

    // Render synthetic baseline (Before) and synthetic disaster (After)
    state.simulator.renderSyntheticSatelliteImage(el.sliderBeforeCanvas, sc.type, false);
    state.simulator.renderSyntheticSatelliteImage(el.sliderAfterCanvas, sc.type, true);

    updateSliderDividerPosition(state.sliderPos);
  }

  function updateSliderDividerPosition(pct) {
    state.sliderPos = Math.max(0, Math.min(100, pct));
    if (el.sliderDivider) el.sliderDivider.style.left = `${state.sliderPos}%`;
    if (el.afterLayerWrap) {
      // Reveal After image from 0 to sliderPos%
      el.afterLayerWrap.style.clipPath = `polygon(0 0, ${state.sliderPos}% 0, ${state.sliderPos}% 100%, 0 100%)`;
    }
    if (el.sliderPctLabel) {
      el.sliderPctLabel.textContent = `BEFORE: ${Math.round(100 - state.sliderPos)}% | AFTER: ${Math.round(state.sliderPos)}%`;
    }
  }

  // Drag interaction for Before/After Slider
  if (el.sliderContainer) {
    const handleMove = (clientX) => {
      const rect = el.sliderContainer.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      updateSliderDividerPosition(pct);
    };

    el.sliderContainer.addEventListener('mousedown', (e) => {
      state.isDraggingSlider = true;
      handleMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (state.isDraggingSlider) handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      state.isDraggingSlider = false;
    });

    // Touch Support
    el.sliderContainer.addEventListener('touchstart', (e) => {
      state.isDraggingSlider = true;
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (state.isDraggingSlider && e.touches[0]) handleMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      state.isDraggingSlider = false;
    });
  }

  // Toggle Damage Mask Overlay Button
  if (el.toggleMaskBtn) {
    el.toggleMaskBtn.addEventListener('click', () => {
      playClick();
      state.isDamageMaskActive = !state.isDamageMaskActive;
      el.toggleMaskBtn.classList.toggle('active', state.isDamageMaskActive);
      el.toggleMaskBtn.textContent = state.isDamageMaskActive ? 'Damage Mask: ON' : 'Damage Mask: OFF';
      renderComparisonSlider();
      renderImpactMap();
    });
  }

  // ==========================================
  // INTERACTIVE IMPACT MAP CANVAS ENGINE
  // ==========================================
  function renderImpactMap() {
    if (!el.impactMapCanvas) return;
    const canvas = el.impactMapCanvas;
    const ctx = canvas.getContext('2d');
    const sc = state.currentScenario;

    const w = canvas.parentElement.clientWidth || 700;
    const h = 420;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Apply zoom
    ctx.translate(w / 2, h / 2);
    ctx.scale(state.mapZoom, state.mapZoom);
    ctx.translate(-w / 2, -h / 2);

    // 1. Layer: Satellite Base Imagery
    if (state.activeMapLayers.satellite) {
      state.simulator.renderSyntheticSatelliteImage(canvas, sc.type, true);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Layer: Damage Mask Heatmap/Polygons
    if (state.activeMapLayers.damageMask && state.isDamageMaskActive) {
      ctx.fillStyle = sc.type === 'Flood' ? 'rgba(56, 189, 248, 0.45)' : sc.type === 'Wildfire' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.45)';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.48, w * 0.35, h * 0.35, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Detection boundary outline
      ctx.strokeStyle = sc.severityColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Layer: Evacuation Corridors & Road Networks
    if (state.activeMapLayers.evacuation) {
      // Safe evacuation route (Green)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.9);
      ctx.lineTo(w * 0.45, h * 0.82);
      ctx.lineTo(w * 0.85, h * 0.95);
      ctx.stroke();

      // Route arrow/label
      ctx.fillStyle = '#22c55e';
      ctx.font = "10px 'Space Grotesk', monospace";
      ctx.fillText("PRIMARY SAFE EVACUATION CORRIDOR", w * 0.35, h * 0.88);
    }

    // 4. Layer: Critical Infrastructure Markers
    if (state.activeMapLayers.infrastructure && sc.impact.infrastructure) {
      const positions = [
        { x: w * 0.28, y: h * 0.32 },
        { x: w * 0.52, y: h * 0.48 },
        { x: w * 0.72, y: h * 0.36 },
        { x: w * 0.40, y: h * 0.65 },
        { x: w * 0.82, y: h * 0.80 }
      ];

      sc.impact.infrastructure.forEach((item, idx) => {
        const pos = positions[idx % positions.length];

        // Marker pin outer glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = item.severity === 'critical' ? 'rgba(239, 68, 68, 0.35)' : item.severity === 'high' ? 'rgba(249, 115, 22, 0.35)' : 'rgba(34, 197, 94, 0.35)';
        ctx.fill();

        // Pin body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f97316' : '#22c55e';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();

        // Pin emoji icon
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.icon, pos.x, pos.y + 4);

        // Marker title pill
        ctx.font = "9px 'Space Grotesk', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(item.name.split(' ')[0], pos.x, pos.y - 14);
      });
    }

    ctx.restore();
  }

  // Map Zoom Controls
  if (el.mapZoomInBtn) {
    el.mapZoomInBtn.addEventListener('click', () => {
      playClick();
      state.mapZoom = Math.min(2.5, state.mapZoom + 0.25);
      renderImpactMap();
    });
  }
  if (el.mapZoomOutBtn) {
    el.mapZoomOutBtn.addEventListener('click', () => {
      playClick();
      state.mapZoom = Math.max(0.6, state.mapZoom - 0.25);
      renderImpactMap();
    });
  }
  if (el.mapZoomResetBtn) {
    el.mapZoomResetBtn.addEventListener('click', () => {
      playClick();
      state.mapZoom = 1.0;
      renderImpactMap();
    });
  }

  // Layer Toggles
  if (el.layerToggleCheckboxes) {
    el.layerToggleCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        playClick();
        const layer = e.target.dataset.layer;
        if (layer) {
          state.activeMapLayers[layer] = e.target.checked;
          renderImpactMap();
        }
      });
    });
  }

  // ==========================================
  // EXPORT SITUATION REPORT (SITREP)
  // ==========================================
  if (el.exportSitrepBtn) {
    el.exportSitrepBtn.addEventListener('click', () => {
      playClick();
      const sc = state.currentScenario;
      const timestamp = new Date().toISOString();

      const sitrepText = `================================================================================
TERRAWATCH EMERGENCY DISASTER SITUATION REPORT (SITREP)
================================================================================
INCIDENT NAME:      ${sc.title.toUpperCase()}
HAZARD CLASSIFICATION: ${sc.type.toUpperCase()} (SEVERITY: ${sc.severity.toUpperCase()})
GEOSPATIAL LOCATION:  ${sc.location}
COORDINATES:         ${sc.coordinates}
REPORT TIMESTAMP:    ${timestamp}
SENSING PLATFORM:    ${sc.sensorPlatform}
ANALYSIS ALGORITHM:  ${sc.methodologyUsed}
================================================================================
EXECUTIVE DAMAGE SUMMARY:
* Total Affected Area:       ${sc.impact.affectedAreaSqKm} km² (${sc.impact.affectedHectares} hectares)
* Population at Direct Risk: ~${sc.impact.displacedPopulationEst.toLocaleString()} residents
* Severity Breakdown:
  - Critical Impact Zone:    ${sc.impact.severityBreakdown.criticalInundated || sc.impact.severityBreakdown.criticalBurnScar || sc.impact.severityBreakdown.collapsedStructures}
  - Secondary Inundation/Risk: ${sc.impact.severityBreakdown.partiallyFlooded || sc.impact.severityBreakdown.activeFirePerimeter || sc.impact.severityBreakdown.severeStructuralDamage}

CRITICAL INFRASTRUCTURE STATUS ASSESSMENT:
${sc.impact.infrastructure.map(i => `[${i.type.toUpperCase()}] ${i.name.padEnd(35)} -> ${i.status}`).join('\n')}

RECOMMENDED EMERGENCY CIVIL DEFENSE ACTIONS:
${sc.impact.emergencyActions.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}

================================================================================
DISCLAIMER:
This report was generated via the TERRAWATCH Satellite Remote Sensing Prototype
for demonstration, triage training, and hackathon presentation purposes.
Verified civil defense integration requires multi-agency ground corroboration.
================================================================================`;

      const blob = new Blob([sitrepText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SITREP_${sc.id}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // ==========================================
  // INFRASTRUCTURE DETAILS MODAL
  // ==========================================
  function openInfraModal(name, type, status) {
    if (!el.infraModal || !el.infraModalBody) return;
    playClick();

    el.infraModalBody.innerHTML = `
      <div class="modal-infra-header">
        <span class="infra-type-badge">${type.toUpperCase()}</span>
        <h3>${name}</h3>
        <p class="infra-status-p">${status}</p>
      </div>

      <div class="modal-infra-content">
        <h4>Operational Readiness Assessment:</h4>
        <p>Satellite telemetry flags structural or access compromise within the primary 500m buffer zone.</p>
        <div class="modal-spec-grid">
          <div class="spec-card">
            <span class="spec-k">Facility Category</span>
            <span class="spec-v">${type}</span>
          </div>
          <div class="spec-card">
            <span class="spec-k">Satellite Resolution</span>
            <span class="spec-v">${state.currentScenario.resolution}</span>
          </div>
          <div class="spec-card">
            <span class="spec-k">Recommended Action</span>
            <span class="spec-v">Route access via secondary corridor</span>
          </div>
        </div>
      </div>
    `;

    el.infraModal.classList.add('open');
  }

  function closeInfraModal() {
    playClick();
    if (el.infraModal) el.infraModal.classList.remove('open');
  }

  if (el.closeInfraModalBtn) el.closeInfraModalBtn.addEventListener('click', closeInfraModal);
  if (el.infraModal) {
    el.infraModal.addEventListener('click', (e) => {
      if (e.target === el.infraModal) closeInfraModal();
    });
  }

  // ==========================================
  // METHODOLOGY SECTION RENDERING
  // ==========================================
  function renderMethodology() {
    if (!el.methodologyCardsGrid) return;

    el.methodologyCardsGrid.innerHTML = TERRA_DATA.methodology.map(item => `
      <div class="methodology-card glass-card">
        <div class="method-header">
          <span class="method-cat">${item.category}</span>
          <span class="method-badge">${item.badge}</span>
        </div>
        <h3 class="method-title">${item.title}</h3>
        <div class="formula-box">
          <code>${item.formula}</code>
        </div>
        <p class="method-sensor"><strong>Sensor Platform:</strong> ${item.sensor}</p>
        <p class="method-desc">${item.explanation}</p>
        <div class="method-note">
          <small>⚡ <strong>Operational Note:</strong> ${item.accuracyNote}</small>
        </div>
      </div>
    `).join('');
  }

  // Keyboard shortcut listener
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      switchSection('dashboard');
      setTimeout(() => el.searchInput && el.searchInput.focus(), 100);
    } else if (e.key === 'Escape') {
      closeInfraModal();
    }
  });

  // --- INITIALIZATION ---
  updateDashboardSummaryMetrics();
  renderDashboardFilters();
  renderScenarioCards();
  populateAnalysisPresets();
  renderMethodology();
  updateResultsPanel(state.currentScenario);

  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
});
