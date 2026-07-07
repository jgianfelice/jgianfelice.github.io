'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

// ── The world itself ─────────────────────────────────────────────────
// igloo.inc's realism is one continuous landscape: a snowfield underfoot
// that climbs into REAL mountains at the edges of the frame, their ridges
// rising into the sky, fog only softening the far ones. The flight corridor
// stays open down the middle; everything else is range.

// Darker than the sky/fog on purpose — the range must SILHOUETTE. White
// mountains against a white sky are invisible (learned the hard way).
const SNOW = '#c3cad1';

// A soft round sprite for particle points — without this, three.js renders
// every point as a hard SQUARE the moment one drifts near the camera.
export function useSoftDot(): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);
}

// Rolling floor + ridged mountain chains. Ridge noise (1-|n|)^p gives sharp
// crests; the mask keeps the corridor clear and lets peaks grow at the sides.
export function Terrain({
  y = -2.6,
  width = 200,
  depth = 200,
  zCenter = -30,
  corridor = 6,
  peak = 13,
}: {
  y?: number;
  width?: number;
  depth?: number;
  zCenter?: number;
  corridor?: number;
  peak?: number;
}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, depth, 150, 150);
    const noise = new ImprovedNoise();
    const pos = g.attributes.position as THREE.BufferAttribute;
    const fbm = (x: number, z: number) =>
      noise.noise(x * 0.02, z * 0.02, 0) +
      noise.noise(x * 0.05, z * 0.05, 7.3) * 0.5 +
      noise.noise(x * 0.11, z * 0.11, 13.1) * 0.25;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); // becomes world -Z after rotation

      // The valley floor rolls gently everywhere — visible drifts underfoot.
      const floor = Math.max(0, fbm(x, z) + 0.7) * 1.1;

      // Ridged mountains: sharp crests that climb fast outside the corridor.
      const r1 = Math.pow(1 - Math.abs(noise.noise(x * 0.016 + 5, z * 0.016, 3.7)), 2.4);
      const r2 = Math.pow(1 - Math.abs(noise.noise(x * 0.034 + 11, z * 0.034, 9.2)), 2.0) * 0.45;
      const side = Math.abs(x);
      // 0 inside the corridor → 1 by corridor+11: the range crowds the path.
      const mask = Math.min(1, Math.max(0, (side - corridor) / 11));
      const mountains = (r1 + r2) * peak * mask * (0.75 + 0.25 * Math.abs(noise.noise(x * 0.008, z * 0.008, 21)));

      pos.setZ(i, floor + mountains);
    }
    g.computeVertexNormals();
    return g;
  }, [width, depth, corridor, peak]);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, zCenter]}>
      <meshStandardMaterial color={SNOW} roughness={0.95} metalness={0} />
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
