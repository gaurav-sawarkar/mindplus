/**
 * TERRAWATCH - Geospatial Satellite Orbital Grid & Scanning Radar Canvas
 * Renders an interactive Earth observation satellite network, orbital ground tracks,
 * latitude/longitude grid coordinates, and active radar sweep lines.
 */

class SatelliteGridCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.satellites = [];
    this.radarScanX = 0;
    this.radarSpeed = 1.2;
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, active: false };
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    this.createSatellites();
    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createSatellites() {
    this.satellites = [
      { name: "SENTINEL-1A", x: 100, y: 150, vx: 0.8, vy: 0.35, color: "#38bdf8", sensor: "SAR C-Band", trail: [] },
      { name: "SENTINEL-2B", x: 450, y: 300, vx: -0.65, vy: 0.45, color: "#10b981", sensor: "MSI Optical", trail: [] },
      { name: "LANDSAT-9", x: 800, y: 100, vx: 0.5, vy: -0.3, color: "#f59e0b", sensor: "OLI-2", trail: [] },
      { name: "WORLDVIEW-3", x: 250, y: 550, vx: 0.7, vy: -0.4, color: "#a855f7", sensor: "VHR 0.3m", trail: [] }
    ];
  }

  createParticles() {
    this.particles = [];
    const count = Math.floor((this.width * this.height) / 8000);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.5 + 0.15,
        pulseSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Subtle Geospatial Latitude & Longitude Coordinate Grid
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = "rgba(56, 189, 248, 0.04)";
    const gridSpacing = 90;

    // Vertical Longitude Lines
    for (let x = 0; x < this.width; x += gridSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Horizontal Latitude Lines
    for (let y = 0; y < this.height; y += gridSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // 2. Radar Sweep Beam across screen
    this.radarScanX += this.radarSpeed;
    if (this.radarScanX > this.width + 150) {
      this.radarScanX = -150;
    }

    const radarGrad = this.ctx.createLinearGradient(
      this.radarScanX - 120, 0,
      this.radarScanX, 0
    );
    radarGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
    radarGrad.addColorStop(0.85, "rgba(56, 189, 248, 0.025)");
    radarGrad.addColorStop(1, "rgba(56, 189, 248, 0.12)");

    this.ctx.fillStyle = radarGrad;
    this.ctx.fillRect(this.radarScanX - 120, 0, 120, this.height);

    // Sharp radar front line
    this.ctx.beginPath();
    this.ctx.moveTo(this.radarScanX, 0);
    this.ctx.lineTo(this.radarScanX, this.height);
    this.ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // 3. Background Telemetry Star/Data Nodes
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.alpha += p.pulseSpeed;
      if (p.alpha > 0.65 || p.alpha < 0.15) {
        p.pulseSpeed = -p.pulseSpeed;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(186, 230, 253, ${p.alpha})`;
      this.ctx.fill();

      // Mouse interactive constellation link
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 80) * 0.2})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    // 4. Orbiting Earth Observation Satellites
    this.satellites.forEach(sat => {
      // Update coordinates
      sat.x += sat.vx;
      sat.y += sat.vy;

      // Wrap around edges
      if (sat.x > this.width + 50) sat.x = -50;
      if (sat.x < -50) sat.x = this.width + 50;
      if (sat.y > this.height + 50) sat.y = -50;
      if (sat.y < -50) sat.y = this.height + 50;

      // Record ground track trail
      sat.trail.push({ x: sat.x, y: sat.y });
      if (sat.trail.length > 40) sat.trail.shift();

      // Draw orbit ground track
      if (sat.trail.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(sat.trail[0].x, sat.trail[0].y);
        for (let t = 1; t < sat.trail.length; t++) {
          this.ctx.lineTo(sat.trail[t].x, sat.trail[t].y);
        }
        this.ctx.strokeStyle = `${sat.color}33`;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // Draw satellite sensor swath footprint (cone)
      this.ctx.beginPath();
      this.ctx.moveTo(sat.x, sat.y);
      this.ctx.lineTo(sat.x - 30, sat.y + 45);
      this.ctx.lineTo(sat.x + 30, sat.y + 45);
      this.ctx.closePath();
      this.ctx.fillStyle = `${sat.color}08`;
      this.ctx.fill();

      // Satellite icon (solar panel wings)
      this.ctx.save();
      this.ctx.translate(sat.x, sat.y);

      // Panels
      this.ctx.fillStyle = sat.color;
      this.ctx.fillRect(-10, -2, 6, 4);
      this.ctx.fillRect(4, -2, 6, 4);

      // Body bus
      this.ctx.fillStyle = "#ffffff";
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Label
      this.ctx.font = "8px 'Space Grotesk', monospace";
      this.ctx.fillStyle = `${sat.color}cc`;
      this.ctx.fillText(sat.name, 12, 3);

      this.ctx.restore();
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.satelliteGridInstance = new SatelliteGridCanvas('starfieldCanvas');
});
