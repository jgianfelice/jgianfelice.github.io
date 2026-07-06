'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

// ── The world itself ─────────────────────────────────────────────────
// igloo.inc's realism is layers: a terrain that rises at the edges of the
// frame, fog that swallows the horizon, and objects grounded by their own
// shadows. This is that world in our light-concrete palette — a rolling
// snowfield with a clear valley down the camera's flight path, fading to
// white where the fog takes over (the fog IS the sky).

const SNOW = '#e3e7eb';

// Fractal noise heightfield. The valley: amplitude grows with |x|, so dunes
// climb at the frame's edges and the path down the middle stays open.
export function Terrain({
  y = -2.6,
  width = 170,
  depth = 170,
  zCenter = -30,
  valleyHalfWidth = 7,
}: {
  y?: number;
  width?: number;
  depth?: number;
  zCenter?: number;
  valleyHalfWidth?: number;
}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, depth, 180, 180);
    const noise = new ImprovedNoise();
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const zLocal = pos.getY(i); // plane's own Y becomes world -Z after rotation
      // FBM: three octaves of Perlin, gentle.
      const n =
        noise.noise(x * 0.02, zLocal * 0.02, 0) * 1.0 +
        noise.noise(x * 0.055, zLocal * 0.055, 7.3) * 0.45 +
        noise.noise(x * 0.14, zLocal * 0.14, 13.1) * 0.18;
      // Dunes swell away from the valley centre-line.
      const side = Math.max(0, Math.abs(x) - valleyHalfWidth);
      const swell = 0.35 + Math.min(1, side / 26) * 4.2;
      pos.setZ(i, Math.max(0, n + 0.9) * swell);
    }
    g.computeVertexNormals();
    return g;
  }, [width, depth, valleyHalfWidth]);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, zCenter]} receiveShadow>
      <meshStandardMaterial color={SNOW} roughness={0.96} metalness={0} />
    </mesh>
  );
}

// A soft dark blob that ties a floating object to the ground — the cheap,
// convincing version of a contact shadow.
export function GroundShadow({
  position,
  scale = 2.4,
  opacity = 0.16,
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 64);
    grad.addColorStop(0, 'rgba(20,24,30,1)');
    grad.addColorStop(0.55, 'rgba(20,24,30,0.42)');
    grad.addColorStop(1, 'rgba(20,24,30,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}
