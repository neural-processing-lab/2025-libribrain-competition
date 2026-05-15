'use client';

import { useEffect, useRef } from 'react';

interface Wave {
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  lineWidth: number;
  noiseFreq: number;
  noiseAmp: number;
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Define wave channels — like MEG sensor traces
    const waves: Wave[] = [
      // Main waves
      { y: 0.15, amplitude: 28, frequency: 0.008, speed: 0.4, phase: 0, color: 'rgba(167, 139, 250, 0.25)', lineWidth: 1.5, noiseFreq: 0.025, noiseAmp: 12 },
      { y: 0.30, amplitude: 22, frequency: 0.012, speed: 0.3, phase: 1.2, color: 'rgba(147, 197, 253, 0.22)', lineWidth: 1.3, noiseFreq: 0.03, noiseAmp: 15 },
      { y: 0.45, amplitude: 32, frequency: 0.006, speed: 0.5, phase: 2.5, color: 'rgba(196, 181, 253, 0.25)', lineWidth: 1.5, noiseFreq: 0.02, noiseAmp: 10 },
      { y: 0.60, amplitude: 18, frequency: 0.015, speed: 0.35, phase: 0.8, color: 'rgba(125, 211, 252, 0.2)', lineWidth: 1.2, noiseFreq: 0.035, noiseAmp: 18 },
      { y: 0.75, amplitude: 25, frequency: 0.01, speed: 0.45, phase: 3.7, color: 'rgba(216, 180, 254, 0.22)', lineWidth: 1.3, noiseFreq: 0.022, noiseAmp: 14 },
      { y: 0.88, amplitude: 20, frequency: 0.013, speed: 0.38, phase: 5.1, color: 'rgba(165, 180, 252, 0.2)', lineWidth: 1.2, noiseFreq: 0.028, noiseAmp: 16 },

      // Background waves for depth
      { y: 0.22, amplitude: 15, frequency: 0.018, speed: 0.25, phase: 4.2, color: 'rgba(196, 181, 253, 0.1)', lineWidth: 0.8, noiseFreq: 0.04, noiseAmp: 8 },
      { y: 0.52, amplitude: 12, frequency: 0.02, speed: 0.2, phase: 1.8, color: 'rgba(147, 197, 253, 0.08)', lineWidth: 0.8, noiseFreq: 0.045, noiseAmp: 6 },
      { y: 0.68, amplitude: 14, frequency: 0.016, speed: 0.28, phase: 3.0, color: 'rgba(167, 139, 250, 0.08)', lineWidth: 0.8, noiseFreq: 0.038, noiseAmp: 10 },
    ];

    // Simple seeded noise function
    const noise = (x: number) => {
      const s = Math.sin(x * 127.1 + x * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    // Smooth noise interpolation
    const smoothNoise = (x: number) => {
      const ix = Math.floor(x);
      const fx = x - ix;
      const t = fx * fx * (3 - 2 * fx); // smoothstep
      return noise(ix) * (1 - t) + noise(ix + 1) * t;
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      for (const wave of waves) {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const baseY = h * wave.y;

        for (let x = 0; x <= w; x += 2) {
          // Combine sine waves at different frequencies for EEG-like signal
          const t = time * wave.speed;
          const mainWave = Math.sin(x * wave.frequency + t + wave.phase) * wave.amplitude;
          const harmonic1 = Math.sin(x * wave.frequency * 2.3 + t * 1.3 + wave.phase) * wave.amplitude * 0.3;
          const harmonic2 = Math.sin(x * wave.frequency * 4.1 + t * 0.7 + wave.phase * 1.5) * wave.amplitude * 0.15;

          // Add noise for organic feel (like real MEG data)
          const n = (smoothNoise((x + t * 60) * wave.noiseFreq) - 0.5) * 2 * wave.noiseAmp;

          // Spike-like bursts (alpha/beta oscillation bursts)
          const burst = Math.pow(Math.sin(x * 0.003 + t * 0.15 + wave.phase * 2), 8) * wave.amplitude * 0.8;

          const y = baseY + mainWave + harmonic1 + harmonic2 + n + burst;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Draw subtle electrode dots at left edge
      for (const wave of waves) {
        if (wave.lineWidth < 1.5) continue; // skip background waves
        const baseY = h * wave.y;
        ctx.beginPath();
        ctx.arc(8, baseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = wave.color.replace(/[\d.]+\)$/, '0.3)');
        ctx.fill();
      }

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
