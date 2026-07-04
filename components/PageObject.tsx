'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import type { SectionSlug } from '@/lib/content';

// A small frosted ice crystal, one per page, carrying the same section emblem
// the hero uses — so every sub-page keeps a piece of the landing page's 3D
// world instead of reading as a flat document. Light "concrete + ice" palette.
const ICE = '#CBD3DA';
const GRAPH = '#3C434B';
const GRAPH_STRONG = '#1E2227';
const BASE = '#E8EAED';

function Mat({ c }: { c: string }) {
  return <meshStandardMaterial color={c} roughness={0.5} metalness={0.06} />;
}

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
    if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.25;
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

function Crystal({ children }: { children: React.ReactNode }) {
  const shell = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (shell.current) {
      shell.current.rotation.y += 0.003;
      shell.current.rotation.x += 0.0012;
    }
  });
  return (
    <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.7}>
      <group>{children}</group>
      <mesh ref={shell}>
        <dodecahedronGeometry args={[1.3, 0]} />
        <MeshTransmissionMaterial
          transmissionSampler
          samples={4}
          thickness={0.5}
          ior={1.3}
          chromaticAberration={0.05}
          anisotropicBlur={0.2}
          roughness={0.18}
          distortion={0.25}
          distortionScale={0.3}
          temporalDistortion={0.08}
          transmission={1}
          color={ICE}
          attenuationColor={ICE}
          attenuationDistance={6}
        />
      </mesh>
      <mesh scale={1.001}>
        <dodecahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial color={GRAPH_STRONG} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

export default function PageObject({
  slug,
  className = '',
}: {
  slug: SectionSlug;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 4.6], fov: 42 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.9} color="#ffffff" />
          <pointLight position={[4, 5, 4]} intensity={16} color="#ffffff" distance={40} decay={1.4} />
          <pointLight position={[-5, -2, 2]} intensity={7} color="#e7ecf1" distance={40} decay={1.5} />
          <Crystal>
            <Emblem slug={slug} />
          </Crystal>
          <Environment resolution={128} frames={1}>
            <color attach="background" args={[BASE]} />
            <Lightformer intensity={1.4} position={[0, 4, -5]} scale={[10, 10, 1]} color="#ffffff" />
            <Lightformer intensity={1.0} position={[-5, 1, 3]} scale={[7, 7, 1]} color="#aeb6bf" />
          </Environment>
        </Canvas>
      )}
    </div>
  );
}
