/**
 * TERRAWATCH - Satellite Disaster Analysis Engine & Impact Mapping Simulator
 * Powers the interactive Before/After image comparison, synthetic satellite renderer,
 * custom user image upload processor, and interactive geospatial impact map.
 */

class SatelliteSimulator {
  constructor() {
    this.currentScenario = null;
    this.uploadedImage = null;
    this.activeLayers = {
      satellite: true,
      damageMask: true,
      infrastructure: true,
      evacuation: true,
      heatmap: false
    };
    this.sliderPosition = 50; // percentage
  }

  /**
   * Generates synthetic high-fidelity satellite imagery on canvas for demonstration
   */
  renderSyntheticSatelliteImage(canvas, type, isAfter, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width || 600;
    const h = canvas.height || 400;

    ctx.clearRect(0, 0, w, h);

    if (type === 'Flood') {
      this.drawFloodScene(ctx, w, h, isAfter, options);
    } else if (type === 'Wildfire') {
      this.drawWildfireScene(ctx, w, h, isAfter, options);
    } else {
      // Urban Damage
      this.drawUrbanScene(ctx, w, h, isAfter, options);
    }

    // Overlay satellite telemetry grid watermark
    this.drawSatelliteWatermark(ctx, w, h, type, isAfter);
  }

  drawFloodScene(ctx, w, h, isAfter, options) {
    // 1. Base terrain (Agricultural & riparian vegetation)
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#1e293b');
    bgGrad.addColorStop(0.4, '#14532d'); // green fields
    bgGrad.addColorStop(0.7, '#166534');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Field parcels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 60) {
      for (let y = 30; y < h; y += 45) {
        ctx.strokeRect(x, y, 50, 35);
      }
    }

    // Roads
    ctx.strokeStyle = isAfter ? '#94a3b8' : '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    ctx.bezierCurveTo(w * 0.3, h * 0.4, w * 0.6, h * 0.55, w, h * 0.5);
    ctx.stroke();

    // River
    if (!isAfter) {
      // Pre-flood: Normal river channel
      ctx.beginPath();
      ctx.moveTo(w * 0.1, 0);
      ctx.bezierCurveTo(w * 0.35, h * 0.4, w * 0.4, h * 0.6, w * 0.85, h);
      ctx.lineWidth = 28;
      ctx.strokeStyle = '#0284c7';
      ctx.lineCap = 'round';
      ctx.stroke();
    } else {
      // Post-flood: Catastrophic Inundation
      // Expanded flood basin
      const floodGrad = ctx.createRadialGradient(w * 0.45, h * 0.5, 40, w * 0.45, h * 0.5, 220);
      floodGrad.addColorStop(0, '#0369a1');
      floodGrad.addColorStop(0.6, '#0284c7');
      floodGrad.addColorStop(0.9, 'rgba(56, 189, 248, 0.7)');
      floodGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = floodGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.45, h * 0.5, w * 0.38, h * 0.42, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Flood polygon branches
      ctx.beginPath();
      ctx.moveTo(w * 0.05, 0);
      ctx.bezierCurveTo(w * 0.3, h * 0.35, w * 0.45, h * 0.65, w * 0.95, h);
      ctx.lineWidth = 75;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.85)';
      ctx.stroke();

      // Inundated road section alert
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.43);
      ctx.lineTo(w * 0.65, h * 0.53);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  drawWildfireScene(ctx, w, h, isAfter, options) {
    // 1. Forest & chaparral canopy
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(0.5, '#065f46');
    bgGrad.addColorStop(1, '#042f2e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Mountain ridges & contours
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1.5;
    for (let r = 50; r < 350; r += 40) {
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.45, r * 1.4, r, -0.3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Highway
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.bezierCurveTo(w * 0.4, h * 0.75, w * 0.7, h * 0.9, w, h * 0.7);
    ctx.stroke();

    if (isAfter) {
      // Post-wildfire: Charred burn scar & active thermal fire front
      // 1. Charred burn scar (dark charcoal ash)
      const scarGrad = ctx.createRadialGradient(w * 0.48, h * 0.42, 20, w * 0.48, h * 0.42, 180);
      scarGrad.addColorStop(0, '#1c1917');
      scarGrad.addColorStop(0.5, '#292524');
      scarGrad.addColorStop(0.85, 'rgba(68, 64, 60, 0.85)');
      scarGrad.addColorStop(1, 'rgba(68, 64, 60, 0)');

      ctx.fillStyle = scarGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.42, w * 0.32, h * 0.35, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Active Fire Front (thermal infrared bright orange/yellow perimeter)
      ctx.beginPath();
      ctx.arc(w * 0.62, h * 0.38, 70, 0.8 * Math.PI, 1.8 * Math.PI);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 14;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ef4444';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w * 0.62, h * 0.38, 70, 0.8 * Math.PI, 1.8 * Math.PI);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Smoke plume dispersion
      const smokeGrad = ctx.createRadialGradient(w * 0.7, h * 0.28, 10, w * 0.8, h * 0.2, 140);
      smokeGrad.addColorStop(0, 'rgba(214, 211, 209, 0.75)');
      smokeGrad.addColorStop(0.6, 'rgba(168, 162, 158, 0.45)');
      smokeGrad.addColorStop(1, 'rgba(120, 113, 108, 0)');
      ctx.fillStyle = smokeGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.75, h * 0.25, 120, 70, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawUrbanScene(ctx, w, h, isAfter, options) {
    // 1. Urban street grid & blocks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Coastal shoreline / bay
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(w * 0.82, 0);
    ctx.bezierCurveTo(w * 0.75, h * 0.4, w * 0.8, h * 0.7, w * 0.95, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Urban City Blocks
    const blockSize = 32;
    const gap = 12;
    for (let x = 30; x < w * 0.75; x += blockSize + gap) {
      for (let y = 30; y < h - 40; y += blockSize + gap) {
        if (!isAfter) {
          // Pre: intact buildings (clean rectangles)
          ctx.fillStyle = '#334155';
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, blockSize, blockSize);
        } else {
          // Post: Some collapsed structures & rubble fields
          const isDamaged = (Math.sin(x * 12.3 + y * 9.1) > 0.15);
          if (isDamaged) {
            // Rubble / collapse polygon
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(x - 2, y + 4);
            ctx.lineTo(x + blockSize + 3, y - 2);
            ctx.lineTo(x + blockSize - 4, y + blockSize + 2);
            ctx.lineTo(x + 2, y + blockSize + 4);
            ctx.closePath();
            ctx.fill();

            // Debris dots in street
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(x + blockSize + 5, y + 10, 3, 0, Math.PI * 2);
            ctx.arc(x - 5, y + 15, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x, y, blockSize, blockSize);
            ctx.strokeStyle = '#334155';
            ctx.strokeRect(x, y, blockSize, blockSize);
          }
        }
      }
    }

    // Main Avenue
    ctx.strokeStyle = isAfter ? '#b91c1c' : '#f8fafc';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w * 0.78, h * 0.5);
    ctx.stroke();
  }

  drawSatelliteWatermark(ctx, w, h, type, isAfter) {
    ctx.save();
    ctx.font = "10px 'Space Grotesk', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.textAlign = "left";
    ctx.fillText(`SENSOR: SENTINEL/LANDSAT EO • BAND COMBINATION: MULTI-SPECTRAL`, 12, h - 24);
    ctx.fillText(`MODE: ${isAfter ? 'POST-EVENT ACQUISITION [DETECTED DAMAGE]' : 'PRE-EVENT BASELINE REFERENCE'}`, 12, h - 10);

    ctx.textAlign = "right";
    ctx.fillStyle = isAfter ? "#ef4444" : "#10b981";
    ctx.fillText(isAfter ? "ALERT: ANOMALY FLAGGED" : "BASELINE CALIBRATED", w - 12, h - 10);
    ctx.restore();
  }

  /**
   * Process user-uploaded image for simulated AI disaster inference
   */
  async processUserUploadedImage(file, disasterType = 'Flood') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.uploadedImage = img;

          // Analyze image color properties and estimate synthetic metrics
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(img.width, 800);
          canvas.height = Math.min(img.height, 600);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imgData.data;

          let blueDominance = 0;
          let redDominance = 0;
          let varianceSum = 0;

          // Sample pixels
          const step = 4 * 10;
          let sampledCount = 0;
          for (let i = 0; i < pixels.length; i += step) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            if (b > r + 20 && b > g) blueDominance++;
            if (r > g + 20 && r > b) redDominance++;
            varianceSum += Math.abs(r - g) + Math.abs(g - b);
            sampledCount++;
          }

          const ratioBlue = (blueDominance / sampledCount) * 100;
          const ratioRed = (redDominance / sampledCount) * 100;
          const textureComplexity = (varianceSum / sampledCount);

          // Generate simulated impact results
          const estArea = (Math.max(25, (sampledCount / 100) * 0.45)).toFixed(1);
          const popEst = Math.round(estArea * 450);

          const result = {
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            dimensions: `${img.width} × ${img.height} px`,
            inferredType: disasterType,
            confidenceScore: "94.6%",
            affectedAreaSqKm: estArea,
            displacedEst: popEst,
            processedDataUrl: canvas.toDataURL(),
            detectedAnomalies: [
              `Spectral Index Signature Extracted (${disasterType === 'Flood' ? 'NDWI Water Index' : disasterType === 'Wildfire' ? 'dNBR Burn Ratio' : 'Morphological Discontinuity'})`,
              `Simulated Segmented Area: ${estArea} km²`,
              `Estimated Affected Infrastructure: ${Math.round(estArea / 8)} facilities flagged`,
              `Data Quality: Cloud cover verified below threshold`
            ]
          };

          resolve(result);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

window.SatelliteSimulator = SatelliteSimulator;
