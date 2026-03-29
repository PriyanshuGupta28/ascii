import type { ParticleConfig } from "@/components/ParticleField";

export function generateExportCode(svg: string, config: ParticleConfig, density: number): string {
  return `// Particle SVG Animation — Generated Code
// Dependencies: react, three, @react-three/fiber
// npm install three @react-three/fiber

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── SVG to Points ───────────────────────────────────────────────
interface Point2D { x: number; y: number; }

function svgToPoints(svgString: string, canvasSize: number, density: number = ${density}): Promise<Point2D[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize; canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No 2d context")); return; }
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
      const points: Point2D[] = [];
      for (let y = 0; y < canvasSize; y += density) {
        for (let x = 0; x < canvasSize; x += density) {
          const i = (y * canvasSize + x) * 4;
          if (imageData.data[i + 3] > 128) {
            points.push({ x: x - canvasSize / 2, y: -(y - canvasSize / 2) });
          }
        }
      }
      URL.revokeObjectURL(url);
      resolve(points);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG load failed")); };
    img.src = url;
  });
}

// ─── Particle Field ──────────────────────────────────────────────
const PARTICLE_SIZE = ${config.particleSize.toFixed(1)};
const OPACITY = ${config.opacity.toFixed(2)};
const MOUSE_RADIUS = ${config.mouseRadius};
const MOUSE_STRENGTH = ${config.mouseStrength};
const RETURN_SPEED = ${config.returnSpeed.toFixed(2)};
const DAMPING = ${config.damping.toFixed(2)};
const COLOR = "${config.color}";

const vertexShader = \`
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = \${PARTICLE_SIZE.toFixed(1)} * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
\`;

const fragmentShader = \`
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float softness = 1.0 - smoothstep(0.15, 0.5, dist);
    gl_FragColor = vec4(uColor, softness * vAlpha * \${OPACITY.toFixed(2)});
  }
\`;

function ParticleField({ points, mouseRef }: { points: Point2D[]; mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  const meshRef = useRef<THREE.Points>(null);
  const count = points.length;

  const { homePositions, velocities, initialPositions, initialAlphas } = useMemo(() => {
    const home = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    const alp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = points[i].x, y = points[i].y;
      pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=0;
      home[i*3]=x; home[i*3+1]=y; home[i*3+2]=0;
      alp[i]=1.0;
    }
    return { homePositions: home, velocities: vel, initialPositions: pos, initialAlphas: alp };
  }, [points, count]);

  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(COLOR) } }), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posArr = (geo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    const alpArr = (geo.getAttribute("aAlpha") as THREE.BufferAttribute).array as Float32Array;
    const mx = mouseRef.current.x, my = mouseRef.current.y;
    for (let i = 0; i < count; i++) {
      const ix = i*3, iy = ix+1;
      const dx = posArr[ix]-mx, dy = posArr[iy]-my;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < MOUSE_RADIUS && dist > 0.1) {
        const force = (1-dist/MOUSE_RADIUS)*MOUSE_STRENGTH;
        velocities[ix]+=(dx/dist)*force; velocities[iy]+=(dy/dist)*force;
      }
      velocities[ix]+=(homePositions[ix]-posArr[ix])*RETURN_SPEED;
      velocities[iy]+=(homePositions[iy]-posArr[iy])*RETURN_SPEED;
      velocities[ix]*=DAMPING; velocities[iy]*=DAMPING;
      posArr[ix]+=velocities[ix]; posArr[iy]+=velocities[iy];
      const dispX=posArr[ix]-homePositions[ix], dispY=posArr[iy]-homePositions[iy];
      alpArr[i]=Math.max(0.35,1-Math.sqrt(dispX*dispX+dispY*dispY)/60);
    }
    geo.getAttribute("position").needsUpdate=true;
    geo.getAttribute("aAlpha").needsUpdate=true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={initialPositions} count={count} itemSize={3}/>
        <bufferAttribute attach="attributes-aAlpha" array={initialAlphas} count={count} itemSize={1}/>
      </bufferGeometry>
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
  );
}

// ─── Event Plane ─────────────────────────────────────────────────
function EventPlane({ size, mouseRef }: { size: number; mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  return (
    <mesh position={[0,0,-1]} onPointerMove={(e: any) => mouseRef.current.set(e.point.x,e.point.y)} onPointerLeave={() => mouseRef.current.set(9999,9999)}>
      <planeGeometry args={[size,size]}/>
      <meshBasicMaterial transparent opacity={0}/>
    </mesh>
  );
}

// ─── Main Component ──────────────────────────────────────────────
const SVG = \`${svg.replace(/`/g, "\\`")}\`;

export default function SvgParticleAnimation() {
  const [points, setPoints] = useState<Point2D[]>([]);
  const mouseRef = useRef(new THREE.Vector2(9999,9999));
  const size = 400;

  useEffect(() => { svgToPoints(SVG, size, ${density}).then(setPoints).catch(console.error); }, []);

  if (points.length === 0) return null;

  return (
    <div style={{ width: size, height: size }} className="cursor-crosshair">
      <Canvas orthographic camera={{ zoom:1, position:[0,0,100], near:0.1, far:1000 }} gl={{ alpha:true, antialias:true }} style={{ background:"transparent" }}>
        <EventPlane size={size} mouseRef={mouseRef}/>
        <ParticleField points={points} mouseRef={mouseRef}/>
      </Canvas>
    </div>
  );
}
`;
}
