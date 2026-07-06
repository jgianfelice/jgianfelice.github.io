'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Text,
  Float,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  MeshReflectorMaterial,
  Billboard,
} from '@react-three/drei';
import {
  EffectComposer,
  ChromaticAberration,
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

// Light "concrete + ice" scene: a pale cool-grey field with frosted-glass
// crystals and dark graphite objects sealed inside. Emphasis now reads DARKER
// (not brighter) — there is no glow to lean on, so contrast does the work.
const GRAPH = '#3C434B';        // primary graphite — up candles / emblems
const GRAPH_STRONG = '#1E2227'; // darkest emphasis — equity line, hover marks
const GRAPH_SOFT = '#9AA1A8';   // receded grey — down candles / ghosted index
const ICE = '#CBD3DA';          // cool crystal tint
const INK = '#24272C';          // near-black cool text
const BG = '#E8EAED';           // pale cool-grey concrete field

// Space Grotesk — the UI/label voice, for every word in the scene.
// Computer Modern — Knuth's LaTeX faces. Typewriter for instrument labels,
// Serif Roman for in-world prose, Serif Bold for the big section titles.
const FONT_MONO = '/fonts/cmuntt.ttf';
const FONT_MONO_REG = '/fonts/cmunrm.ttf';
const FONT_SERIF_BOLD = '/fonts/cmunbx.ttf';

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

export const SECTION_S = [0.17, 0.33, 0.49, 0.65, 0.81];
export const HERO_END = 0.1;

// Phones crop the wide crystal compositions hard, so everything in the world
// answers to one question: is the viewport narrow? Crystals shrink to fit,
// glass distortion calms down (the refraction doubles read as glitches when
// cropped), and the in-world side titles hand off to an HTML overlay.
function useNarrow(): boolean {
  const { size } = useThree();
  return size.width < 640 || size.width / size.height < 0.75;
}

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
        const col = c.up ? GRAPH : GRAPH_SOFT;
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
                roughness={0.55}
                metalness={0.05}
              />
            </mesh>
          </group>
        );
      })}
      {/* @ts-ignore - drawRange-animated equity line */}
      <line ref={lineRef as any}>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color={GRAPH_STRONG} transparent opacity={0.95} />
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
  // Lit graphite solids — no emissive; contrast against the pale field reads
  // them. (Second arg kept for call-site compatibility, intentionally unused.)
  const mat = (c: string, _i = 0.8) => (
    <meshStandardMaterial color={c} roughness={0.5} metalness={0.06} />
  );
  return (
    <group ref={ref}>
      {kind === 0 && <CandleChart introRef={introRef} scale={0.72} />}
      {kind === 1 && (
        // Certifications — a faceted seal/gem
        <mesh rotation={[0.3, 0, 0]}>
          <octahedronGeometry args={[0.62, 0]} />
          {mat(GRAPH, 0.7)}
        </mesh>
      )}
      {kind === 2 && (
        // Learning — rising stacked bars
        <group position={[0, -0.5, 0]}>
          {[0.4, 0.7, 1.0, 1.3].map((h, i) => (
            <mesh key={i} position={[(i - 1.5) * 0.34, h / 2, 0]}>
              <boxGeometry args={[0.22, h, 0.22]} />
              {mat(i % 2 ? GRAPH : GRAPH_STRONG, 0.8)}
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
            {mat(GRAPH_STRONG, 1.0)}
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.85, Math.sin(a) * 0.6, Math.sin(a) * 0.4]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                {mat(GRAPH, 0.9)}
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
        <lineBasicMaterial color={GRAPH_STRONG} />
      </line>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={GRAPH} roughness={0.5} metalness={0.06} />
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
  const narrow = useNarrow();
  const rng = useMemo(() => mulberry32(seed), [seed]);
  const rot = useMemo<[number, number, number]>(
    () => [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
    [rng]
  );
  const size = big ? 2.05 : 1.7;
  const fit = narrow ? 0.66 : 1;

  useFrame((state) => {
    const e = easeOut(clamp01(introRef.current));
    if (shell.current) {
      shell.current.rotation.y += 0.0016;
      shell.current.rotation.x += 0.0007;
    }
    if (grp.current) grp.current.scale.setScalar((0.6 + e * 0.4) * fit);
  });

  return (
    <group ref={grp} position={position}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.5}>
        {/* The frozen object sealed inside */}
        <group>{children}</group>

        {/* The ice shell — faceted glass with refraction + chromatic edge.
            Kept thin and clear so the object inside reads through it. On
            narrow screens the distortion calms right down: cropped refraction
            doubles are what read as "glitches" on a phone. */}
        <mesh ref={shell} rotation={rot} raycast={() => null}>
          <dodecahedronGeometry args={[size, 0]} />
          <MeshTransmissionMaterial
            transmissionSampler
            samples={narrow ? 4 : 6}
            thickness={0.6}
            ior={1.31}
            chromaticAberration={narrow ? 0.04 : 0.14}
            anisotropicBlur={narrow ? 0.15 : 0.25}
            roughness={0.16}
            distortion={narrow ? 0.1 : 0.3}
            distortionScale={0.35}
            temporalDistortion={narrow ? 0.015 : 0.08}
            transmission={1}
            color={ICE}
            attenuationColor={ICE}
            attenuationDistance={8}
          />
        </mesh>
        {/* Fine graphite wire tracing the facet edges */}
        <mesh rotation={rot} scale={1.001} raycast={() => null}>
          <dodecahedronGeometry args={[size, 0]} />
          <meshBasicMaterial color={GRAPH_STRONG} wireframe transparent opacity={0.08} />
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
  const narrow = useNarrow();

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

  // Phones: the side compositions can't fit — the HTML overlay in
  // Experience carries the section title instead.
  if (narrow) return null;

  return (
    <group ref={group} position={anchor}>
      <Text
        ref={idxRef}
        font={FONT_MONO}
        fontSize={2.0}
        fillOpacity={0}
        anchorX={side < 0 ? 'right' : 'left'}
        anchorY="middle"
        color={GRAPH_SOFT}
        position={[0, 1.5, -0.5]}
      >
        {section.index}
      </Text>
      <Text
        ref={titleRef}
        font={FONT_SERIF_BOLD}
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
        color={GRAPH_STRONG}
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
  picked,
  onPick,
}: {
  introRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
  sections: Section[];
  // A tapped face (touch devices, which cannot hover). Lifted to
  // MarketSurface so the canvas background can clear it, and so the HTML
  // layer can show a matching "enter this section" card.
  picked: number | null;
  onPick: (i: number | null) => void;
}) {
  const grp = useRef<THREE.Group>(null);
  const dir = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<number | null>(null);
  const panelRefs = useRef<THREE.Mesh[]>([]);
  const edgeRefs = useRef<THREE.LineSegments[]>([]);
  const leaderRefs = useRef<THREE.LineSegments[]>([]);
  const labelRefs = useRef<any[]>([]);
  const amt = useRef<number[]>(sections.map(() => 0));
  const narrow = useNarrow();
  // Shrink the whole hero on phones so the full crystal (and the chart inside
  // it) fits the frame — cropped facets sweeping across the chart during the
  // intro is exactly the "right side glitches out" artifact.
  const fit = narrow ? 0.58 : 1;

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
    if (grp.current) grp.current.scale.setScalar((0.6 + e * 0.4) * fit);

    const active = scrollRef.current < HERO_END && introRef.current > 0.5;
    if (dir.current) dir.current.visible = active;
    if (!active) {
      if (hover !== null) setHover(null);
      onPick(null); // guarded in MarketSurface — a no-op once already null
    }

    // Hover (mouse) takes precedence; a tapped face (touch) persists.
    const sel = hover !== null ? hover : picked;
    const t = state.clock.elapsedTime;
    picks.forEach((_, i) => {
      const target = active && sel === i ? 1 : 0;
      amt.current[i] = THREE.MathUtils.damp(amt.current[i], target, 10, delta);
      const a = amt.current[i];
      // staggered breath at rest → a soft dark wash on select. The edge
      // outline is the discoverability cue (a fine graphite line on the pale
      // ice); the surface fill is a softer secondary tint. On this light field
      // emphasis is DARK, so the fill stays light — a hint, not a black panel.
      const breath = 0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.25);
      const idleFill = active ? 0.04 + 0.04 * breath : 0;
      const idleEdge = active ? 0.28 + 0.16 * breath : 0;
      const panel = panelRefs.current[i];
      if (panel) {
        (panel.material as THREE.MeshBasicMaterial).opacity = idleFill * (1 - a) + 0.3 * a;
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
              samples={narrow ? 4 : 6}
              resolution={narrow ? 384 : 768}
              backside={!narrow}
              backsideThickness={0.3}
              thickness={0.6}
              ior={1.31}
              chromaticAberration={narrow ? 0.04 : 0.1}
              anisotropicBlur={narrow ? 0.15 : 0.25}
              roughness={0.16}
              distortion={narrow ? 0.1 : 0.25}
              distortionScale={0.35}
              temporalDistortion={narrow ? 0.015 : 0.06}
              transmission={1}
              color={ICE}
              attenuationColor={ICE}
              attenuationDistance={8}
            />
          </mesh>
          {/* fine graphite wire tracing the facet edges */}
          <mesh scale={1.001} raycast={() => null}>
            <dodecahedronGeometry args={[HERO_SIZE, 0]} />
            <meshBasicMaterial color={GRAPH_STRONG} wireframe transparent opacity={0.14} />
          </mesh>

          {/* The directory — five real faces, marked on hover/tap. */}
          <group ref={dir} visible={false}>
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
                      // Touch/pen can't hover: first tap reveals the section
                      // preview (and its Enter button in the HTML layer); tap
                      // again to dismiss. A mouse click flies straight down to
                      // the section, exactly as before.
                      if (ev.pointerType === 'touch' || ev.pointerType === 'pen') {
                        onPick(picked === i ? null : i);
                      } else {
                        const max = document.body.scrollHeight - window.innerHeight;
                        window.scrollTo({ top: SECTION_S[i] * max, behavior: 'smooth' });
                      }
                    }}
                  >
                    <bufferGeometry>
                      <bufferAttribute attach="attributes-position" args={[f.verts, 3]} />
                    </bufferGeometry>
                    <meshBasicMaterial
                      color={GRAPH_STRONG}
                      transparent
                      opacity={0}
                      side={THREE.DoubleSide}
                      depthWrite={false}
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
                      color={GRAPH_STRONG}
                      transparent
                      opacity={0}
                      depthWrite={false}
                    />
                  </lineSegments>

                  {/* Leader line + floating name — pointer screens only. On a
                      phone the ring of names lands outside the viewport, and
                      the tap-preview card already carries the section name. */}
                  {!narrow && (
                    <>
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
                          depthWrite={false}
                        />
                      </lineSegments>

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
                    </>
                  )}
                </group>
              );
            })}
          </group>
        </group>
      </Float>
    </group>
  );
}

// Airborne frost drifting through the whole flight path — the igloo move:
// the air itself is alive, in front of and behind every crystal, so the
// camera is always flying THROUGH something.
function FrostDrift({ count = 520 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = 6 - Math.random() * 82; // spans hero → last station
    }
    return arr;
  }, [count]);

  useFrame((s, dt) => {
    const p = ref.current;
    if (!p) return;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - dt * (0.14 + (i % 7) * 0.015);
      if (y < -7) y = 7;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.35 + i) * dt * 0.045);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={GRAPH_SOFT}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  );
}

// A soft white light that shadows the cursor through the frozen space — the
// ice glints and shifts as you move, igloo's "the world notices you" trick.
function CursorLight({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const l = useRef<THREE.PointLight>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    if (!l.current) return;
    target.set(pointer.current.x * 4.5, 1.2 + pointer.current.y * 2.4, 2.6);
    l.current.position.lerp(target, Math.min(1, dt * 5));
  });
  return (
    <pointLight ref={l} position={[0, 1.2, 2.6]} intensity={13} color="#ffffff" distance={16} decay={1.7} />
  );
}

function World({
  sections,
  scrollRef,
  pointer,
  picked,
  onPick,
}: {
  sections: Section[];
  scrollRef: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  picked: number | null;
  onPick: (i: number | null) => void;
}) {
  // The hero crystal grows on load; section crystals grow when reached.
  const heroIntro = useRef(0);
  const narrow = useNarrow();
  useFrame((_, delta) => {
    heroIntro.current = Math.min(1, heroIntro.current + delta / 2.4);
  });

  return (
    <>
      {/* Bright, even, cool-neutral light so the graphite objects read as
          solid darks and the glass picks up clean specular highlights. */}
      <ambientLight intensity={0.9} color={'#ffffff'} />
      <hemisphereLight args={['#ffffff', '#ced4da', 0.55]} />
      <pointLight position={[6, 7, 6]} intensity={26} color={'#ffffff'} distance={60} decay={1.4} />
      <pointLight position={[-8, -2, 3]} intensity={12} color={'#e7ecf1'} distance={50} decay={1.5} />
      <CursorLight pointer={pointer} />

      {/* The frozen lake — a blurred-reflection floor running the whole
          flight, so every crystal stands over its own ghost. The fog eats it
          at the horizon. Desktop only; phones skip the double render. */}
      {!narrow && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, -30]}>
          <planeGeometry args={[90, 120]} />
          <MeshReflectorMaterial
            blur={[420, 120]}
            resolution={512}
            mixBlur={0.95}
            mixStrength={0.55}
            roughness={0.8}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#dde1e6"
            metalness={0}
            mirror={0.35}
          />
        </mesh>
      )}

      {/* The air itself moves. */}
      <FrostDrift />

      {/* Hero crystal — the chart sealed in ice, and the site's directory:
          five of the crystal's real faces light up under the cursor. */}
      <HeroCrystal
        introRef={heroIntro}
        scrollRef={scrollRef}
        sections={sections}
        picked={picked}
        onPick={onPick}
      />

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

      {/* A mostly-light environment with one mid-grey panel — the crystals
          need a darker reflection to refract, or they vanish into the field. */}
      <Environment resolution={512} frames={1}>
        <color attach="background" args={[BG]} />
        <Lightformer intensity={1.5} position={[0, 5, -6]} scale={[12, 12, 1]} color={'#ffffff'} />
        <Lightformer intensity={1.0} position={[-6, 1, 3]} scale={[8, 8, 1]} color={'#aeb6bf'} />
        <Lightformer intensity={1.0} position={[6, -2, 3]} scale={[8, 8, 1]} color={'#eef2f6'} />
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
  onHeroPick,
  onReady,
}: {
  sections: Section[];
  onSceneChange?: (i: number) => void;
  onHeroPick?: (i: number | null) => void;
  // Fires once the WebGL context is live — the HTML loader fades on this.
  onReady?: () => void;
}) {
  const scrollRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  // The hero doubles as a directory, so the canvas only accepts pointer
  // events while you're in the hero; below that it stays click-through.
  const [interactive, setInteractive] = useState(true);

  // A tapped hero face (touch only). Guarded so repeated clears are no-ops,
  // which lets HeroCrystal safely clear it from its frame loop.
  const [picked, setPicked] = useState<number | null>(null);
  const pickedRef = useRef<number | null>(null);
  const pick = (i: number | null) => {
    if (pickedRef.current === i) return;
    pickedRef.current = i;
    setPicked(i);
    onHeroPick?.(i);
  };

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
    // Cache the scroll range. On mobile the URL bar collapses on first scroll,
    // which changes window.innerHeight; recomputing the range every scroll would
    // re-map progress and jerk the camera mid-intro (the "zoom in/out glitch").
    // So the range is recomputed only on a real WIDTH change (or a settle pass),
    // never on height-only changes.
    let maxH = 1;
    let lastW = typeof window !== 'undefined' ? window.innerWidth : 0;
    const recompute = () => {
      maxH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / maxH));
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
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        recompute();
        onScroll();
      }
    };
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    recompute();
    onScroll();
    // Re-measure once the layout has settled (fonts, mobile chrome), without
    // moving the camera if we're still parked at the top.
    const settle = window.setTimeout(() => {
      recompute();
      onScroll();
    }, 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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
          onPointerMissed={() => pick(null)}
          onCreated={() => requestAnimationFrame(() => onReady?.())}
        >
          <color attach="background" args={[BG]} />
          <fog attach="fog" args={[BG, 9, 30]} />
          <CameraRig keyframes={keyframes} scrollRef={scrollRef} pointer={pointer} />
          <World
            sections={sections}
            scrollRef={scrollRef}
            pointer={pointer}
            picked={picked}
            onPick={pick}
          />

          {/* No Bloom/Vignette on a light field — they'd wash the pale
              background to white and dirty the corners. Contrast does the work;
              a faint chromatic edge and grain keep the glass and texture. */}
          <EffectComposer>
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0005, 0.0005)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.035} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
