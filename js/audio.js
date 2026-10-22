/**
 * TERRAWATCH - Web Audio API Telemetry & Emergency Alert Synthesizer
 * Generates futuristic radar pings, analysis scan sweeps, and emergency alert tones
 * without external audio files.
 */

class TerraAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('terra_sound_muted') === 'true';
    this.scanningOsc = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('terra_sound_muted', this.isMuted);
    return this.isMuted;
  }

  // Tactical UI Click
  playClick() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Radar Ping / Sonar Telemetry Beep
  playRadarPing() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // Analysis Complete / Success Chime
  playSuccess() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A Major arpeggio

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.07, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    } catch (e) {}
  }

  // Critical Alert Tone (Two-tone pulse)
  playEmergencyAlert() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(740, now + 0.12);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(370, now + 0.12);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.26);
      osc2.stop(now + 0.26);
    } catch (e) {}
  }

  // Scan Sweep Sound
  startScanHum() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      if (this.scanningOsc) return;

      this.scanningOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      this.scanningOsc.type = 'triangle';
      this.scanningOsc.frequency.setValueAtTime(180, this.ctx.currentTime);
      this.scanningOsc.frequency.linearRampToValueAtTime(520, this.ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.scanningOsc.connect(gain);
      gain.connect(this.ctx.destination);

      this.scanningOsc.start();
    } catch (e) {}
  }

  stopScanHum() {
    if (this.scanningOsc) {
      try {
        this.scanningOsc.stop();
        this.scanningOsc.disconnect();
      } catch (e) {}
      this.scanningOsc = null;
    }
  }
}

window.terraAudio = new TerraAudio();
