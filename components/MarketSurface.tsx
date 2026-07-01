'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Text,
  Float,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  Billboard,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ── The Frozen Market ──────────────────────────────────────────────
// Modeled directly on igloo.inc: every section lives sealed inside its
// own glass-ice crystal, and the camera DRIFTS forward through a frozen
// space from one to the next — crystals emerge out of the frost, refract
// the light, and carry a soft chromatic edge. The hero is one crystal
// holding the chart, and only the chart: no text, no chrome — just the
// object. Titles surface beside each crystal as the camera arrives.

const BLUE = '#7FB6E6';      // up candles / accents
const BLUE_HOT = '#DCEEFF';  // bright glints (equity line, head) — blooms
const BLUE_DIM = '#3E6E99';  // down candles / ghosted index
const ICE = '#BFE0F5';       // crystal tint
const INK = '#EAF2FB';       // near-white text
const BG = '#0E1620';        // muted blue-grey void

// igloo.inc's typeface — IBM Plex Mono, for every word in the scene.
const FONT_MONO = '/fonts/IBMPlexMono-Medium.ttf';
const FONT_MONO_REG = '/fonts/IBMPlexMono-Regular.ttf';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Section = { href: string; index: string; title: string; desc: string };

// Where each crystal sits in the frozen space. The hero is at the origin
// and the section crystals recede INTO the scene (depth), drifting gently
// side to side — so the camera flies forward through them, never panning
// flatly left-to-right.
const STATIONS: [number, number, number][] = [
  [0, 0, 0], // hero
  [-3.4, 0.8, -13],
  [3.3, -0.7, -26.5],
  [-3.0, 1.1, -40],
  [3.4, 0.1, -53.5],
  [-2.4, -1.0, -67],
];

const SECTION_S = [0.17, 0.33, 0.49, 0.65, 0.81];
const HERO_END = 0.1;

// ── Mini candlestick chart — the thing sealed inside the hero crystal ──
function CandleChart({
  introRef,
  scale = 1,
}: {
  introRef: React.MutableRefObject<number>;
  scale?: number;
}) {
  const N = 16;
  const candles = useMemo(() => {
    const rng = mulberry32(7);
    let price = 0.4;
    const arr: { x: number; lo: number; hi: number; bC: number; bH: number; up: boolean }[] = [];
    const SP = 0.16;
    for (let i = 0; i < N; i++) {
      const open = price;
      price = open + (rng() - 0.5) * 0.16 + 0.05;
      const close = price;
      const hi = Math.max(open, close) + rng() * 0.06 + 0.02;
      const lo = Math.min(open, close) - rng() * 0.06 - 0.02;
      arr.push({
        x: (i - (N - 1) / 2) * SP,
        lo,
        hi,
        bC: (open + close) / 2,
        bH: Math.max(Math.abs(close - open), 0.03),
        up: close >= open,
      });
    }
    return arr;
  }, []);

  const groupRefs = useRef<THREE.Group[]>([]);
  const lineRef = useRef<THREE.Line>(null);

  const linePts = useMemo(
    () => candles.map((c) => new THREE.Vector3(c.x, c.bC, 0.02)),
    [candles]
  );
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(linePts);
    g.setDrawRange(0, 0);
    return g;
  }, [linePts]);

  useFrame(() => {
    const p = introRef.current; // 0→1
    groupRefs.current.forEach((g, i) => {
      if (!g) return;
      const local = clamp01((p * N - i) / 3);
      g.scale.y = easeOut(local);
    });
    const n = Math.floor(clamp01((p - 0.1) / 0.9) * N);
    lineGeo.setDrawRange(0, Math.max(0, n));
  });

  return (
    <group scale={scale} position={[0, -0.55, 0]}>
      {candles.map((c, i) => {
        const col = c.up ? BLUE : BLUE_DIM;
        return (
          <group
            key={i}
            ref={(el) => {
              if (el) groupRefs.current[i] = el as THREE.Group;
            }}
            position={[c.x, c.lo, 0]}
            scale={[1, 0.001, 1]}
          >
            <mesh position={[0, (c.hi - c.lo) / 2, 0]}>
              <boxGeometry args={[0.012, c.hi - c.lo, 0.012]} />
              <meshBasicMaterial color={col} />
            </mesh>
            <mesh position={[0, c.bC - c.lo, 0]}>
              <boxGeometry args={[0.075, c.bH, 0.075]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={c.up ? 0.9 : 0.5}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      {/* @ts-ignore - drawRange-animated equity line */}
      <line ref={lineRef as any}>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color={BLUE_HOT} transparent opacity={0.95} />
      </line>
    </group>
  );
}

// ── Section emblems — a distinct little glowing object per crystal ─────
function Emblem({ kind, introRef }: { kind: number; introRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      const e = easeOut(clamp01(introRef.current));
      ref.current.scale.setScalar(e);
    }
  });
  const mat = (c: string, i = 0.8) => (
    <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} roughness={0.25} />
  );
  return (
    <group ref={ref}>
      {kind === 0 && <CandleChart introRef={introRef} scale={0.72} />}
      {kind === 1 && (
        // Certifications — a faceted seal/gem
        <mesh rotation={[0.3, 0, 0]}>
          <octahedronGeometry args={[0.62, 0]} />
          {mat(BLUE, 0.7)}
        </mesh>
      )}
      {kind === 2 && (
        // Learning — rising stacked bars
        <group position={[0, -0.5, 0]}>
          {[0.4, 0.7, 1.0, 1.3].map((h, i) => (
            <mesh key={i} position={[(i - 1.5) * 0.34, h / 2, 0]}>
              <boxGeometry args={[0.22, h, 0.22]} />
              {mat(i % 2 ? BLUE : BLUE_HOT, 0.8)}
            </mesh>
          ))}
        </group>
      )}
      {kind === 3 && (
        // Logs — a jagged line graph
        <LineGraph />
      )}
      {kind === 4 && (
        // About — a node with orbiting points
        <group>
          <mesh>
            <icosahedronGeometry args={[0.42, 0]} />
            {mat(BLUE_HOT, 1.0)}
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.85, Math.sin(a) * 0.6, Math.sin(a) * 0.4]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                {mat(BLUE, 0.9)}
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

function LineGraph() {
  const pts = useMemo(() => {
    const rng = mulberry32(3);
    return Array.from({ length: 9 }, (_, i) => {
      return new THREE.Vector3((i - 4) * 0.22, (rng() - 0.4) * 0.5 + i * 0.07 - 0.25, 0);
    });
  }, []);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  return (
    <group>
      {/* @ts-ignore */}
      <line>
        <primitive object={geo} attach="geometry" />
        <lineBasicMaterial color={BLUE_HOT} />
      </line>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── A single ice crystal that seals an object inside ────────────────
function Crystal({
  position,
  seed,
  big,
  introRef,
  children,
}: {
  position: [number, number, number];
  seed: number;
  big?: boolean;
  introRef: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const shell = useRef<THREE.Mesh>(null);
  const grp = useRef<THREE.Group>(null);
  const rng = useMemo(() => mulberry32(seed), [seed]);
  const rot = useMemo<[number, number, number]>(
    () => [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
    [rng]
  );
  const size = big ? 2.05 : 1.7;

  useFrame((state) => {
    const e = easeOut(clamp01(introRef.current));
    if (shell.current) {
      shell.current.rotation.y += 0.0016;
      shell.current.rotation.x += 0.0007;
    }
    if (grp.current) grp.current.scale.setScalar(0.6 + e * 0.4);
  });

  return (
    <group ref={grp} position={position}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.5}>
        {/* The frozen object sealed inside */}
        <group>{children}</group>

        {/* The ice shell — faceted glass with refraction + chromatic edge.
            Kept thin and clear so the glowing object inside reads through it. */}
        <mesh ref={shell} rotation={rot} raycast={() => null}>
          <dodecahedronGeometry args={[size, 0]} />
          <MeshTransmissionMaterial
            transmissionSampler
            samples={6}
            thickness={0.6}
            ior={1.31}
            chromaticAberration={0.14}
            anisotropicBlur={0.25}
            roughness={0.16}
            distortion={0.3}
            distortionScale={0.35}
            temporalDistortion={0.08}
            transmission={1}
            color={ICE}
            attenuationColor={ICE}
            attenuationDistance={8}
          />
        </mesh>
        {/* Bright fresnel-ish wire to catch bloom on the facets */}
        <mesh rotation={rot} scale={1.001} raycast={() => null}>
          <dodecahedronGeometry args={[size, 0]} />
          <meshBasicMaterial color={BLUE_HOT} wireframe transparent opacity={0.08} />
        </mesh>
      </Float>
    </group>
  );
}

// ── Section title, surfacing beside its crystal on arrival ──────────
function SectionLabel({
  station,
  side,
  s0,
  section,
  scrollRef,
}: {
  station: [number, number, number];
  side: number;
  s0: number;
  section: Section;
  scrollRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const idxRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const descRef = useRef<any>(null);

  const anchor = useMemo(
    () => new THREE.Vector3(station[0] + side * 3.0, station[1] - 0.2, station[2] + 1.6),
    [station, side]
  );

  useFrame(() => {
    const s = scrollRef.current;
    const prox = 1 - smoothstep(0.0, 0.1, Math.abs(s - s0));
    const e = easeOut(prox);
    if (group.current) {
      group.current.position.set(anchor.x, anchor.y - (1 - e) * 0.6, anchor.z);
      group.current.visible = e > 0.012;
    }
    const setOp = (r: any, base: number) => {
      if (!r) return;
      const o = base * e;
      if (Math.abs((r.__o ?? -1) - o) > 0.012) {
        r.fillOpacity = o;
        r.sync?.();
        r.__o = o;
      }
    };
    setOp(idxRef, 0.4);
    setOp(titleRef, 1);
    setOp(descRef, 0.72);
  });

  return (
    <group ref={group} position={anchor}>
      <Text
        ref={idxRef}
        font={FONT_MONO}
        fontSize={2.0}
        fillOpacity={0}
        anchorX={side < 0 ? 'right' : 'left'}
        anchorY="middle"
        color={BLUE_DIM}
        position={[0, 1.5, -0.5]}
      >
        {section.index}
      </Text>
      <Text
        ref={titleRef}
        font={FONT_MONO}
        fontSize={1.15}
        fillOpacity={0}
        letterSpacing={0.02}
        anchorX={side < 0 ? 'right' : 'left'}
        anchorY="middle"
        color={INK}
        position={[0, 0, 0]}
      >
        {section.title.toUpperCase()}
      </Text>
      <Text
        ref={descRef}
        font={FONT_MONO_REG}
        fontSize={0.26}
        fillOpacity={0}
        lineHeight={1.5}
        maxWidth={5.4}
        anchorX={side < 0 ? 'right' : 'left'}
        anchorY="top"
        color={BLUE_HOT}
        position={[0, -0.8, 0]}
      >
        {section.desc}
      </Text>
    </group>
  );
}

// ── The hero crystal as a directory of its own faces ───────────────
// The first crystal IS the menu. We take five of its REAL pentagon
// faces and hand one to each section. Each lit face breathes faintly so
// you know the ice is alive; cross it with the cursor and that single
// face flares while the section's name surfaces off its surface. Click
// to fly there. No floating nodes, no extra shapes — only the object.

type Face = {
  normal: THREE.Vector3;
  center: THREE.Vector3;
  verts: Float32Array;
  outline: Float32Array;
};

// Group a detail-0 dodecahedron's 36 triangles back into its 12
// pentagon faces, keyed by shared face-normal. Each face carries its
// outward normal, its centre, and the raw triangle vertices (a flat
// pentagon panel we can light up and use as a hit target).
function dodecahedronFaces(radius: number): Face[] {
  const g = new THREE.DodecahedronGeometry(radius, 0);
  const pos = g.attributes.position;
  // Cluster triangles by normal DIRECTION (dot > 0.95 ≈ within 18°). A
  // dodecahedron's face normals are ~63° apart, so every triangle of one
  // pentagon clusters together while distinct faces stay separate — robust
  // where a rounded-string key splits a face at a rounding boundary.
  const clusters: { n: THREE.Vector3; verts: number[] }[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    nrm.copy(b).sub(a).cross(c.clone().sub(a)).normalize();
    if (nrm.dot(a) < 0) nrm.negate(); // force outward for consistent winding
    let cl = clusters.find((k) => k.n.dot(nrm) > 0.95);
    if (!cl) {
      cl = { n: nrm.clone(), verts: [] };
      clusters.push(cl);
    }
    cl.verts.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }
  g.dispose();
  const faces: Face[] = [];
  clusters.forEach(({ verts }) => {
    const p0 = new THREE.Vector3(verts[0], verts[1], verts[2]);
    const p1 = new THREE.Vector3(verts[3], verts[4], verts[5]);
    const p2 = new THREE.Vector3(verts[6], verts[7], verts[8]);
    const normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize();
    const center = normal.clone().multiplyScalar(p0.dot(normal));

    // Recover the pentagon's five corners (dedupe the fan's repeats) and
    // order them around the face centre → a clean closed edge loop we can
    // draw as the face's outline, independent of how it was triangulated.
    const uniq: THREE.Vector3[] = [];
    for (let i = 0; i < verts.length; i += 3) {
      const v = new THREE.Vector3(verts[i], verts[i + 1], verts[i + 2]);
      if (!uniq.some((u) => u.distanceToSquared(v) < 1e-6)) uniq.push(v);
    }
    const u = uniq[0].clone().sub(center).normalize();
    const w = normal.clone().cross(u).normalize();
    uniq.sort((m, n) => {
      const am = Math.atan2(n2(m), n1(m));
      const an = Math.atan2(n2(n), n1(n));
      return am - an;
      function n1(p: THREE.Vector3) {
        return p.clone().sub(center).dot(u);
      }
      function n2(p: THREE.Vector3) {
        return p.clone().sub(center).dot(w);
      }
    });
    const seg: number[] = [];
    for (let i = 0; i < uniq.length; i++) {
      const a0 = uniq[i];
      const b0 = uniq[(i + 1) % uniq.length];
      seg.push(a0.x, a0.y, a0.z, b0.x, b0.y, b0.z);
    }

    faces.push({
      normal,
      center,
      verts: new Float32Array(verts),
      outline: new Float32Array(seg),
    });
  });
  return faces;
}

const HERO_SIZE = 2.05;

function HeroCrystal({
  introRef,
  scrollRef,
  sections,
}: {
  introRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
  sections: Section[];
}) {
  const grp = useRef<THREE.Group>(null);
  const dir = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState<number | null>(null);
  const panelRefs = useRef<THREE.Mesh[]>([]);
  const edgeRefs = useRef<THREE.LineSegments[]>([]);
  const leaderRefs = useRef<THREE.LineSegments[]>([]);
  const labelRefs = useRef<any[]>([]);
  const amt = useRef<number[]>(sections.map(() => 0));
  const lightPos = useRef(new THREE.Vector3());

  // Orient the crystal face-on (one face dead-centre over the chart),
  // then take the five faces ringing it — those become the menu. The
  // orientation is fixed, so the targets never slide out from under you.
  const { rotE, picks, labelPos, leader, anchors } = useMemo(() => {
    const faces = dodecahedronFaces(HERO_SIZE);
    const front = faces.reduce((m, f) => (f.normal.z > m.normal.z ? f : m), faces[0]);
    const q = new THREE.Quaternion().setFromUnitVectors(
      front.normal.clone().normalize(),
      new THREE.Vector3(0, 0, 1)
    );
    // a small artful tilt on top of the face-on alignment
    q.premultiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.14, 0.11, 0)));
    const rotE = new THREE.Euler().setFromQuaternion(q);
    const qInv = q.clone().invert();

    const scored = faces.map((f) => {
      const n = f.normal.clone().applyQuaternion(q);
      const ctr = f.center.clone().applyQuaternion(q);
      return { f, z: n.z, ang: Math.atan2(ctr.y, ctr.x) };
    });
    scored.sort((p1, p2) => p2.z - p1.z); // most camera-facing first
    const ring = scored.slice(1, 6).sort((p1, p2) => p1.ang - p2.ang);
    const picks = ring.map((r) => r.f) as Face[];

    // Each name sits just OUTSIDE the prism, at the end of a short leader
    // line. Take the face centre in the camera-facing frame and push it out
    // radially in x/y only (keeping its depth, so it never changes size),
    // then bring it back into the crystal's local frame so it rides the same
    // transform as its face. The push is ANISOTROPIC — larger horizontally
    // (the viewport is wide) than vertically (it is short) — so a label near
    // the top or bottom of the ring never runs off an edge. The leader runs
    // along that same outward line, ending a hair before the first glyph, and
    // the text is anchored on its outward side so it always grows away from
    // the ice: a line leading to the name, never an arrow beside it.
    const Rh = 2.62; // outward radius for a horizontal direction
    const Rv = 2.32; // outward radius for a vertical direction (less headroom)
    const gap = 0.14; // blank space between the leader end and the first glyph
    const leaderLen = 0.52; // fixed leader length, so it reads at every angle
    const labelPos: THREE.Vector3[] = [];
    const anchors: ('left' | 'right')[] = [];
    const leader = picks.map((f) => {
      const rc = f.center.clone().applyQuaternion(q);
      const r2 = Math.hypot(rc.x, rc.y) || 1;
      const ux = rc.x / r2;
      const uy = rc.y / r2;
      const R = Rh * (1 - Math.abs(uy)) + Rv * Math.abs(uy);
      // leader is a fixed-length stub ending just before the glyph; for the
      // top/bottom faces its inner end tucks under the ice and glows out
      // through it, for the sides it sits fully in the void — either way a
      // clean line reaching from the prism toward the name.
      const rOut = R - gap;
      const rIn = rOut - leaderLen;
      const A = new THREE.Vector3(ux * rIn, uy * rIn, rc.z).applyQuaternion(qInv);
      const B = new THREE.Vector3(ux * rOut, uy * rOut, rc.z).applyQuaternion(qInv);
      labelPos.push(
        new THREE.Vector3(ux * R, uy * R, rc.z).applyQuaternion(qInv)
      );
      anchors.push(ux >= 0 ? 'left' : 'right');
      return new Float32Array([A.x, A.y, A.z, B.x, B.y, B.z]);
    });
    return { rotE, picks, labelPos, leader, anchors };
  }, []);

  useFrame((state, delta) => {
    const e = easeOut(clamp01(introRef.current));
    if (grp.current) grp.current.scale.setScalar(0.6 + e * 0.4);

    const active = scrollRef.current < HERO_END && introRef.current > 0.5;
    if (dir.current) dir.current.visible = active;
    if (!active && hover !== null) setHover(null);

    const t = state.clock.elapsedTime;
    let maxA = 0;
    let hi = 0;
    picks.forEach((_, i) => {
      const target = active && hover === i ? 1 : 0;
      amt.current[i] = THREE.MathUtils.damp(amt.current[i], target, 10, delta);
      const a = amt.current[i];
      if (a > maxA) {
        maxA = a;
        hi = i;
      }
      // staggered breath at rest → bright flare on hover. The edge outline
      // is the discoverability cue (it reads on any GPU, against dark sky or
      // bright ice); the surface fill is a softer secondary glow.
      const breath = 0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.25);
      const idleFill = active ? 0.06 + 0.06 * breath : 0;
      const idleEdge = active ? 0.24 + 0.18 * breath : 0;
      const panel = panelRefs.current[i];
      if (panel) {
        (panel.material as THREE.MeshBasicMaterial).opacity = idleFill * (1 - a) + 0.9 * a;
      }
      const edge = edgeRefs.current[i];
      if (edge) {
        (edge.material as THREE.LineBasicMaterial).opacity = idleEdge * (1 - a) + 0.95 * a;
      }
      const leaderLine = leaderRefs.current[i];
      if (leaderLine) {
        (leaderLine.material as THREE.LineBasicMaterial).opacity = 0.85 * a;
      }
      const lab = labelRefs.current[i];
      if (lab && Math.abs((lab.__o ?? -1) - a) > 0.01) {
        lab.fillOpacity = a;
        lab.sync?.();
        lab.__o = a;
      }
    });

    if (light.current) {
      lightPos.current.copy(picks[hi].center).multiplyScalar(1.4);
      light.current.position.lerp(lightPos.current, 0.3);
      light.current.intensity = maxA * 22;
    }
  });

  return (
    <group ref={grp} position={STATIONS[0]}>
      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.4}>
        {/* The chart, sealed upright inside the ice. */}
        <group>
          <CandleChart introRef={introRef} scale={0.95} />
        </group>

        {/* Ice shell + its interactive faces share ONE fixed orientation,
            so the five section-faces stay put under the cursor. */}
        <group rotation={rotE}>
          <mesh raycast={() => null}>
            <dodecahedronGeometry args={[HERO_SIZE, 0]} />
            <MeshTransmissionMaterial
              transmissionSampler
              samples={6}
              thickness={0.6}
              ior={1.31}
              chromaticAberration={0.14}
              anisotropicBlur={0.25}
              roughness={0.16}
              distortion={0.3}
              distortionScale={0.35}
              temporalDistortion={0.08}
              transmission={1}
              color={ICE}
              attenuationColor={ICE}
              attenuationDistance={8}
            />
          </mesh>
          {/* bright wire to catch bloom on the facets */}
          <mesh scale={1.001} raycast={() => null}>
            <dodecahedronGeometry args={[HERO_SIZE, 0]} />
            <meshBasicMaterial color={BLUE_HOT} wireframe transparent opacity={0.08} />
          </mesh>

          {/* The directory — five real faces, lit on hover. */}
          <group ref={dir} visible={false}>
            <pointLight ref={light} color={BLUE_HOT} distance={9} decay={1.5} intensity={0} />
            {picks.map((f, i) => {
              const sec = sections[i];
              const lpos = labelPos[i];
              const anc = anchors[i];
              return (
                <group key={sec.href}>
                  {/* the face itself — hit target AND additive glow */}
                  <mesh
                    ref={(el) => {
                      if (el) panelRefs.current[i] = el as THREE.Mesh;
                    }}
                    scale={1.014}
                    onPointerOver={(ev) => {
                      ev.stopPropagation();
                      setHover(i);
                      document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={(ev) => {
                      ev.stopPropagation();
                      setHover((h) => (h === i ? null : h));
                      document.body.style.cursor = '';
                    }}
                    onPointerDown={(ev) => {
                      ev.stopPropagation();
                      const max = document.body.scrollHeight - window.innerHeight;
                      window.scrollTo({ top: SECTION_S[i] * max, behavior: 'smooth' });
                    }}
                  >
                    <bufferGeometry>
                      <bufferAttribute attach="attributes-position" args={[f.verts, 3]} />
                    </bufferGeometry>
                    <meshBasicMaterial
                      color={BLUE_HOT}
                      transparent
                      opacity={0}
                      side={THREE.DoubleSide}
                      depthWrite={false}
                      toneMapped={false}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>

                  {/* the face's edge — the resting cue that says "pick me" */}
                  <lineSegments
                    ref={(el) => {
                      if (el) edgeRefs.current[i] = el as THREE.LineSegments;
                    }}
                    scale={1.016}
                    raycast={() => null}
                  >
                    <bufferGeometry>
                      <bufferAttribute attach="attributes-position" args={[f.outline, 3]} />
                    </bufferGeometry>
                    <lineBasicMaterial
                      color={BLUE_HOT}
                      transparent
                      opacity={0}
                      toneMapped={false}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                    />
                  </lineSegments>

                  {/* thin leader line drawn from the prism out to the name */}
                  <lineSegments
                    ref={(el) => {
                      if (el) leaderRefs.current[i] = el as THREE.LineSegments;
                    }}
                    raycast={() => null}
                  >
                    <bufferGeometry>
                      <bufferAttribute attach="attributes-position" args={[leader[i], 3]} />
                    </bufferGeometry>
                    <lineBasicMaterial
                      color={INK}
                      transparent
                      opacity={0}
                      toneMapped={false}
                      depthWrite={false}
                      blending={THREE.AdditiveBlending}
                    />
                  </lineSegments>

                  {/* the section's name, at the end of the leader on hover */}
                  <Billboard position={lpos}>
                    <Text
                      ref={(el) => {
                        if (el) labelRefs.current[i] = el;
                      }}
                      font={FONT_MONO}
                      fontSize={0.15}
                      fillOpacity={0}
                      letterSpacing={0.08}
                      anchorX={anc}
                      anchorY="middle"
                      color={INK}
                    >
                      {sec.index}  {sec.title.toUpperCase()}
                    </Text>
                  </Billboard>
                </group>
              );
            })}
          </group>
        </group>
      </Float>
    </group>
  );
}

function World({
  sections,
  scrollRef,
}: {
  sections: Section[];
  scrollRef: React.MutableRefObject<number>;
}) {
  // The hero crystal grows on load; section crystals grow when reached.
  const heroIntro = useRef(0);
  useFrame((_, delta) => {
    heroIntro.current = Math.min(1, heroIntro.current + delta / 2.4);
  });

  return (
    <>
      <ambientLight intensity={0.5} color={'#9fc6ec'} />
      <hemisphereLight args={['#dcefff', BG, 0.6]} />
      <pointLight position={[6, 6, 6]} intensity={40} color={BLUE_HOT} distance={60} decay={1.5} />
      <pointLight position={[-8, -2, 2]} intensity={20} color={BLUE} distance={50} decay={1.6} />

      {/* Hero crystal — the chart sealed in ice, and the site's directory:
          five of the crystal's real faces light up under the cursor. */}
      <HeroCrystal introRef={heroIntro} scrollRef={scrollRef} sections={sections} />

      {/* Section crystals receding into the frost. */}
      {sections.map((_, j) => (
        <SectionCrystal key={j} j={j} scrollRef={scrollRef} />
      ))}

      {/* Section titles */}
      {sections.map((sec, j) => (
        <SectionLabel
          key={sec.href}
          station={STATIONS[j + 1]}
          side={j % 2 === 0 ? -1 : 1}
          s0={SECTION_S[j]}
          section={sec}
          scrollRef={scrollRef}
        />
      ))}

      <Environment resolution={512} frames={1}>
        <color attach="background" args={[BG]} />
        <Lightformer intensity={1.6} position={[0, 5, -6]} scale={[12, 12, 1]} color={'#eaf6ff'} />
        <Lightformer intensity={1.1} position={[-6, 1, 3]} scale={[8, 8, 1]} color={BLUE} />
        <Lightformer intensity={1.0} position={[6, -2, 3]} scale={[8, 8, 1]} color={'#9fc6ec'} />
      </Environment>
    </>
  );
}

// Wrap a section crystal so each has a stable per-instance intro clock.
function SectionCrystal({
  j,
  scrollRef,
}: {
  j: number;
  scrollRef: React.MutableRefObject<number>;
}) {
  const intro = useRef(0);
  useFrame((_, delta) => {
    const s = scrollRef.current;
    const near = 1 - smoothstep(0.0, 0.16, Math.abs(s - SECTION_S[j]));
    const target = near > 0.04 ? 1 : 0;
    intro.current = THREE.MathUtils.damp(intro.current, target, 3, delta);
  });
  return (
    <Crystal position={STATIONS[j + 1]} seed={j + 2} introRef={intro}>
      <Emblem kind={j} introRef={intro} />
    </Crystal>
  );
}

function CameraRig({
  keyframes,
  scrollRef,
  pointer,
}: {
  keyframes: { s: number; pos: THREE.Vector3; look: THREE.Vector3 }[];
  scrollRef: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const intro = useRef(0);
  const pos = useRef(new THREE.Vector3(0, 0.4, 9));
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const startPos = useMemo(() => new THREE.Vector3(0, 0.4, 9), []);
  const tPos = useMemo(() => new THREE.Vector3(), []);
  const tLook = useMemo(() => new THREE.Vector3(), []);
  const aPos = useMemo(() => new THREE.Vector3(), []);
  const aLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    intro.current = Math.min(1, intro.current + delta / 2.6);
    const e = easeInOut(intro.current);
    const s = scrollRef.current;

    let lo = keyframes[0];
    let hi = keyframes[keyframes.length - 1];
    for (let k = 0; k < keyframes.length - 1; k++) {
      if (s >= keyframes[k].s && s <= keyframes[k + 1].s) {
        lo = keyframes[k];
        hi = keyframes[k + 1];
        break;
      }
    }
    const tt = smoothstep(lo.s, hi.s, s);
    aPos.copy(lo.pos).lerp(hi.pos, tt);
    aLook.copy(lo.look).lerp(hi.look, tt);

    tPos.copy(startPos).lerp(aPos, e);
    tLook.lerp(aLook, e * 0.9 + 0.1);
    tPos.x += pointer.current.x * 0.7;
    tPos.y += pointer.current.y * 0.5;

    pos.current.lerp(tPos, 0.06);
    look.current.lerp(tLook, 0.08);
    state.camera.position.copy(pos.current);
    state.camera.lookAt(look.current);
  });
  return null;
}

export default function MarketSurface({
  sections,
  onSceneChange,
}: {
  sections: Section[];
  onSceneChange?: (i: number) => void;
}) {
  const scrollRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  // The hero doubles as a directory, so the canvas only accepts pointer
  // events while you're in the hero; below that it stays click-through.
  const [interactive, setInteractive] = useState(true);

  const keyframes = useMemo(() => {
    const kf: { s: number; pos: THREE.Vector3; look: THREE.Vector3 }[] = [];
    // Hero — straight on the first crystal.
    kf.push({
      s: 0,
      pos: new THREE.Vector3(0, 0.3, 7),
      look: new THREE.Vector3(0, 0, 0),
    });
    STATIONS.slice(1).forEach((st, j) => {
      const side = j % 2 === 0 ? 1 : -1; // approach from the open side
      kf.push({
        s: SECTION_S[j],
        pos: new THREE.Vector3(st[0] * 0.35 + side * 1.4, st[1] * 0.6 + 0.4, st[2] + 6.2),
        look: new THREE.Vector3(st[0], st[1], st[2]),
      });
    });
    // The flight ends settled on the final crystal — no closing void.
    const last = STATIONS[STATIONS.length - 1];
    kf.push({
      s: 1,
      pos: new THREE.Vector3(last[0] * 0.4, last[1] * 0.6 + 0.3, last[2] + 5.0),
      look: new THREE.Vector3(last[0], last[1], last[2]),
    });
    return kf;
  }, []);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      scrollRef.current = p;
      setInteractive(p < HERO_END);
      let idx: number;
      if (p < HERO_END) idx = 0;
      else {
        let best = 0;
        let bestD = Infinity;
        SECTION_S.forEach((sv, j) => {
          const d = Math.abs(p - sv);
          if (d < bestD) {
            bestD = d;
            best = j;
          }
        });
        idx = best + 1;
      }
      onSceneChange?.(idx);
    };
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, [onSceneChange]);

  return (
    <div
      className={`fixed inset-0 z-0 ${
        interactive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {mounted && (
        <Canvas
          camera={{ position: [0, 0.4, 9], fov: 42 }}
          gl={{ antialias: true }}
          dpr={[1, 1.6]}
          style={{ touchAction: 'pan-y' }}
        >
          <color attach="background" args={[BG]} />
          <fog attach="fog" args={[BG, 9, 30]} />
          <CameraRig keyframes={keyframes} scrollRef={scrollRef} pointer={pointer} />
          <World sections={sections} scrollRef={scrollRef} />

          <EffectComposer>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.5}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0014, 0.0014)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
            <Vignette eskil={false} offset={0.3} darkness={0.82} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
