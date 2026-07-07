'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import Scramble from './Scramble';
import { Terrain, GroundShadow } from './Scenery';
import type { SectionSlug } from '@/lib/content';

// ── The living page world ────────────────────────────────────────────
// Modeled on igloo.inc: a sub-page is not a document with an accent — it is
// the same frozen world, seen standing still, with the content laid over it.
// A fixed full-viewport scene sits behind every page: fog and airborne dust,
// a faint instrument dot-grid, and the section's crystal floating mid-air
// with hyper-real backside refraction. The camera leans with the cursor, the
// crystal answers the scroll, and an instrument HUD annotates the object
// (leader line, bracket chip, live readouts) exactly like igloo's specimen
// labels. Content scrolls above on its own parallax plane.
const ICE = '#CBD3DA';
const GRAPH = '#3C434B';
const GRAPH_STRONG = '#1E2227';
const GRAPH_SOFT = '#9AA1A8';
const BASE = '#E8EAED';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function Mat({ c }: { c: string }) {
  return <meshStandardMaterial color={c} roughness={0.5} metalness={0.06} />;
}

// ── Section emblems, sealed inside the crystal ───────────────────────
function LineGraph() {
  const pts = useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, i) => new THREE.Vector3((i - 3) * 0.28, Math.sin(i * 1.3) * 0.32 + i * 0.02 - 0.1, 0)
      ),
    []
  );
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  return (
    <group>
      {/* @ts-ignore drei/three line element */}
      <line>
        <primitive object={geo} attach="geometry" />
        <lineBasicMaterial color={GRAPH_STRONG} />
      </line>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <Mat c={GRAPH} />
        </mesh>
      ))}
    </group>
  );
}

function Emblem({ slug }: { slug: SectionSlug }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.22;
  });
  return (
    <group ref={g}>
      {slug === 'projects' && (
        <group position={[0, -0.3, 0]}>
          {([[-0.5, 0.55], [-0.17, 0.9], [0.17, 0.68], [0.5, 1.1]] as const).map(([x, h], i) => (
            <mesh key={i} position={[x, h / 2, 0]}>
              <boxGeometry args={[0.16, h, 0.16]} />
              <Mat c={i % 2 ? GRAPH : GRAPH_STRONG} />
            </mesh>
          ))}
        </group>
      )}
      {slug === 'certifications' && (
        <mesh rotation={[0.3, 0, 0]}>
          <octahedronGeometry args={[0.64, 0]} />
          <Mat c={GRAPH} />
        </mesh>
      )}
      {slug === 'learning' && (
        <group position={[0, -0.55, 0]}>
          {[0.45, 0.75, 1.05, 1.35].map((h, i) => (
            <mesh key={i} position={[(i - 1.5) * 0.32, h / 2, 0]}>
              <boxGeometry args={[0.2, h, 0.2]} />
              <Mat c={i % 2 ? GRAPH : GRAPH_STRONG} />
            </mesh>
          ))}
        </group>
      )}
      {slug === 'logs' && <LineGraph />}
      {slug === 'about' && (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.46, 0]} />
            <Mat c={GRAPH_STRONG} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.92, Math.sin(a) * 0.66, Math.sin(a) * 0.4]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <Mat c={GRAPH} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

// ── Airborne dust — the air itself moves, like igloo's snowfield ─────
function Dust({ count = 360 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = -2 - Math.random() * 10;
    }
    return arr;
  }, [count]);

  useFrame((s, dt) => {
    const p = ref.current;
    if (!p) return;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - dt * (0.16 + (i % 5) * 0.02);
      if (y < -6) y = 6;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.4 + i) * dt * 0.05);
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
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

// ── The specimen crystal — hyper-real glass, answering the scroll ────
function Specimen({
  slug,
  dir,
  pointer,
  scrollRef,
  narrow,
}: {
  slug: SectionSlug;
  dir: number;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
  narrow: boolean;
}) {
  const grp = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  useFrame((s, dt) => {
    // Camera leans with the cursor — the whole world tilts, igloo-style.
    // It rides slightly high, tipped down, so the snowfield reads beneath.
    const px = pointer.current.x;
    const py = pointer.current.y;
    camera.position.x += (px * 0.55 - camera.position.x) * Math.min(1, dt * 4);
    camera.position.y += (0.45 + py * -0.35 - camera.position.y) * Math.min(1, dt * 4);
    camera.lookAt(0, -0.1, 0);

    if (grp.current) {
      // The crystal drifts up as you scroll and keeps turning — the page and
      // the world are one machine.
      const sc = scrollRef.current;
      const x = narrow ? dir * 0.85 : dir * Math.min(3.1, viewport.width / 2 - 2.2);
      grp.current.position.x += (x - grp.current.position.x) * Math.min(1, dt * 3);
      // Past the masthead the specimen recedes — it rises out of frame and
      // shrinks toward the corner, so it never sits on top of the content.
      const recede = clamp01((sc - 120) / 420);
      grp.current.position.y = (narrow ? 2.0 : 0.15) + sc * 0.0045;
      grp.current.rotation.y = sc * 0.0006;
      const scale = (narrow ? 0.45 : 1) * (1 - 0.55 * recede);
      grp.current.scale.setScalar(scale);
      grp.current.visible = recede < 0.999;
      // The grounding shadow stays on the snow, tracking the specimen's x and
      // dissolving as it recedes.
      if (shadow.current) {
        shadow.current.position.x = grp.current.position.x;
        shadow.current.scale.setScalar(Math.max(0.001, (narrow ? 0.55 : 1) * (1 - 0.9 * recede)));
        shadow.current.visible = grp.current.visible;
      }
    }
    if (shell.current) {
      shell.current.rotation.y += 0.0022;
      shell.current.rotation.x += 0.0009;
    }
  });

  return (
    <>
      <group ref={shadow}>
        <GroundShadow position={[0, -2.02, 0]} scale={2.6} opacity={0.15} />
      </group>
      <group ref={grp}>
      <Float speed={1.15} rotationIntensity={0.28} floatIntensity={0.65}>
        <Emblem slug={slug} />
        <mesh ref={shell}>
          <dodecahedronGeometry args={[1.42, 0]} />
          <MeshTransmissionMaterial
            samples={narrow ? 4 : 6}
            resolution={narrow ? 384 : 768}
            backside={!narrow}
            backsideThickness={0.28}
            thickness={0.55}
            ior={1.31}
            chromaticAberration={0.05}
            anisotropicBlur={0.25}
            roughness={0.16}
            distortion={0.22}
            distortionScale={0.32}
            temporalDistortion={0.04}
            transmission={1}
            color={ICE}
            attenuationColor={ICE}
            attenuationDistance={6}
          />
        </mesh>
        <mesh scale={1.001}>
          <dodecahedronGeometry args={[1.42, 0]} />
          <meshBasicMaterial color={GRAPH_STRONG} wireframe transparent opacity={0.1} />
        </mesh>
      </Float>
      </group>
    </>
  );
}

// ── The full backdrop, plus the instrument HUD overlay ──────────────
export default function Atmosphere({
  slug,
  side = 'right',
  index,
  title,
}: {
  slug: SectionSlug;
  side?: 'left' | 'right';
  // HUD metadata, passed from the server shell so the Notion-aware content
  // module never enters the client bundle.
  index?: string;
  title?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const hudRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollOut = useRef<HTMLSpanElement>(null);
  const [today, setToday] = useState('••.••.••••');
  const dir = side === 'right' ? 1 : -1;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 767px)');
    const setN = () => setNarrow(mq.matches);
    setN();
    mq.addEventListener('change', setN);

    const d = new Date();
    setToday(
      `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}.${d.getFullYear()}`
    );

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(applyHud);
    };
    const applyHud = () => {
      raf = 0;
      const { x, y } = pointer.current;
      // HUD + grid drift opposite the camera — separate planes, real depth.
      if (hudRef.current)
        hudRef.current.style.transform = `translate3d(${(-x * 12).toFixed(1)}px, ${(-y * 9).toFixed(1)}px, 0)`;
      if (gridRef.current)
        gridRef.current.style.transform = `translate3d(${(x * 7).toFixed(1)}px, ${(y * 5).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
      if (scrollOut.current) {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollOut.current.textContent = `SCROLL ${String(Math.round((window.scrollY / max) * 100)).padStart(3, '0')}%`;
      }
      // The HUD belongs to the masthead specimen — it dissolves with it so it
      // never sits over the content that scrolls up beneath.
      if (hudRef.current) {
        const fade = Math.max(0, Math.min(1, 1 - (window.scrollY - 120) / 380));
        hudRef.current.style.opacity = String(fade);
      }
    };
    onScroll();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      mq.removeEventListener('change', setN);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 select-none pointer-events-none" aria-hidden="true">
      {mounted && (
        <Canvas camera={{ position: [0, 0.15, 7], fov: 40 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
          {/* Opaque field: the transmission buffer needs a real background to
              refract, or the glass reads as a black slab. */}
          <color attach="background" args={[BASE]} />
          <fog attach="fog" args={[BASE, 9, 34]} />
          <ambientLight intensity={0.75} color="#ffffff" />
          <hemisphereLight args={['#ffffff', '#c3c9cf', 0.5]} />
          <directionalLight position={[-14, 16, 8]} intensity={1.35} color="#ffffff" />
          <pointLight position={[5, 6, 5]} intensity={18} color="#ffffff" distance={50} decay={1.4} />
          <pointLight position={[-6, -2, 3]} intensity={8} color="#e7ecf1" distance={40} decay={1.5} />
          {/* The world behind the page — mountains flanking the frame, fog
              softening the far ridges. Same range the hero flies through. */}
          <Terrain y={-2.1} width={120} depth={110} zCenter={-22} corridor={4} peak={8} />
          <Dust />
          <Specimen slug={slug} dir={dir} pointer={pointer} scrollRef={scrollRef} narrow={narrow} />
          <Environment resolution={256} frames={1}>
            <color attach="background" args={[BASE]} />
            <Lightformer intensity={1.5} position={[0, 5, -6]} scale={[12, 12, 1]} color="#ffffff" />
            <Lightformer intensity={1.0} position={[-6, 1, 3]} scale={[8, 8, 1]} color="#aeb6bf" />
            <Lightformer intensity={1.0} position={[6, -2, 3]} scale={[8, 8, 1]} color="#eef2f6" />
          </Environment>
        </Canvas>
      )}

      {/* Instrument dot-grid, faded at the edges, drifting with the cursor —
          a screen-space overlay ABOVE the glass, the way igloo layers it. */}
      <div
        ref={gridRef}
        className="dot-grid absolute -inset-10 opacity-70"
        style={{
          maskImage: 'radial-gradient(75% 65% at 50% 42%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(75% 65% at 50% 42%, black 30%, transparent 100%)',
        }}
      />

      {/* Specimen HUD — leader line + bracket chip + live readouts. */}
      {index && title && (
        <div
          ref={hudRef}
          className={`absolute hidden md:block ${side === 'right' ? 'right-[4%]' : 'left-[4%]'} top-[27%]`}
          style={{ willChange: 'transform' }}
        >
          {/* Leader line runs from the chip toward the specimen (which sits
              nearer the centre of the field), ending in a small node. */}
          <div className="flex items-start">
            {side === 'right' && (
              <div className="mt-4 flex items-center">
                <span className="h-[5px] w-[5px] rounded-full bg-ink/45" />
                <span className="h-px w-24 bg-ink/30" />
              </div>
            )}
            <div className="brackets px-3 py-2 font-mono text-[0.62rem] uppercase leading-[1.9] tracking-[0.22em] text-ink/75">
              <div className="text-faint">{'//////'} IDX_{index}</div>
              <div className="text-ink/90">
                <Scramble text={title.toUpperCase()} duration={1100} delay={250} />
              </div>
              <div>D {today}</div>
              <div>
                <span ref={scrollOut}>SCROLL 000%</span>
              </div>
            </div>
            {side === 'left' && (
              <div className="mt-4 flex items-center">
                <span className="h-px w-24 bg-ink/30" />
                <span className="h-[5px] w-[5px] rounded-full bg-ink/45" />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
