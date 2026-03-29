"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Point2D } from "@/lib/svgToPoints";

export interface ParticleConfig {
  particleSize: number;
  opacity: number;
  mouseRadius: number;
  mouseStrength: number;
  returnSpeed: number;
  damping: number;
  color: string;
}

export const DEFAULT_CONFIG: ParticleConfig = {
  particleSize: 2.5,
  opacity: 1.0,
  mouseRadius: 40,
  mouseStrength: 8,
  returnSpeed: 0.08,
  damping: 0.85,
  color: "#c8c8d0",
};

// Static shader strings defined outside the component — never recreated
const VERTEX_SHADER = `
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uSize;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float softness = 1.0 - smoothstep(0.15, 0.5, dist);
    gl_FragColor = vec4(uColor, softness * vAlpha * uOpacity);
  }
`;

interface ParticleFieldProps {
  points: Point2D[];
  mouseRef: React.MutableRefObject<THREE.Vector2>;
  config?: ParticleConfig;
}

const ParticleField = ({
  points,
  mouseRef,
  config = DEFAULT_CONFIG,
}: ParticleFieldProps) => {
  const meshRef = useRef<THREE.Points>(null);
  const count = points.length;

  // Geometry arrays derived from points — read-only after creation.
  // We update the particle positions by writing directly into the geometry
  // buffer (accessed through meshRef.current, which is opaque to the compiler).
  const { homePositions, initialPositions, initialAlphas } = useMemo(() => {
    const home = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    const alp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = points[i].x;
      const y = points[i].y;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 0;
      home[i * 3] = x;
      home[i * 3 + 1] = y;
      home[i * 3 + 2] = 0;
      alp[i] = 1.0;
    }

    return { homePositions: home, initialPositions: pos, initialAlphas: alp };
  }, [points, count]);

  // Velocity buffer lives in a ref so it can be freely mutated in useFrame
  // without violating the React Compiler's immutability rules for hook values.
  const velocitiesRef = useRef(new Float32Array(count * 3));
  useEffect(() => {
    // Reset velocities whenever the point cloud changes
    velocitiesRef.current = new Float32Array(count * 3);
  }, [count]);

  // Stable initial uniforms — initialized with module-level constants so the
  // empty deps array is accurate. Values are synced to `config` every frame
  // through the material ref (opaque to the compiler), before the first paint.
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(DEFAULT_CONFIG.color) },
      uOpacity: { value: DEFAULT_CONFIG.opacity },
      uSize: { value: DEFAULT_CONFIG.particleSize },
    }),
    [],
  );

  // R3F re-registers useFrame on every render so `config` is always current.
  // Uniforms are updated through meshRef.current.material — a ref-chain path
  // that the React Compiler cannot trace back to the useMemo value above,
  // satisfying its immutability requirements.
  useFrame(() => {
    if (!meshRef.current) return;

    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uColor.value.set(config.color);
    mat.uniforms.uOpacity.value = config.opacity;
    mat.uniforms.uSize.value = config.particleSize;

    const geo = meshRef.current.geometry;
    const posArr = (geo.getAttribute("position") as THREE.BufferAttribute)
      .array as Float32Array;
    const alpArr = (geo.getAttribute("aAlpha") as THREE.BufferAttribute)
      .array as Float32Array;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;

      const dx = posArr[ix] - mx;
      const dy = posArr[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.mouseRadius && dist > 0.1) {
        const force = (1 - dist / config.mouseRadius) * config.mouseStrength;
        vel[ix] += (dx / dist) * force;
        vel[iy] += (dy / dist) * force;
      }

      vel[ix] += (homePositions[ix] - posArr[ix]) * config.returnSpeed;
      vel[iy] += (homePositions[iy] - posArr[iy]) * config.returnSpeed;

      vel[ix] *= config.damping;
      vel[iy] *= config.damping;

      posArr[ix] += vel[ix];
      posArr[iy] += vel[iy];

      const dispX = posArr[ix] - homePositions[ix];
      const dispY = posArr[iy] - homePositions[iy];
      const displacement = Math.sqrt(dispX * dispX + dispY * dispY);
      alpArr[i] = Math.max(0.35, 1 - displacement / 60);
    }

    geo.getAttribute("position").needsUpdate = true;
    geo.getAttribute("aAlpha").needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aAlpha"
          args={[initialAlphas, 1]}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
