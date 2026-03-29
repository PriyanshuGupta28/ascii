"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import ParticleField, {
  type ParticleConfig,
  DEFAULT_CONFIG,
} from "./ParticleField";
import { svgToPoints, type Point2D } from "@/lib/svgToPoints";
import * as THREE from "three";

interface SvgParticleCanvasProps {
  svg: string;
  size?: number;
  density?: number;
  config?: ParticleConfig;
}

const JsonEventPlane = ({
  size,
  mouseRef,
}: {
  size: number;
  mouseRef: React.MutableRefObject<THREE.Vector2>;
}) => {
  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      mouseRef.current.set(e.point.x, e.point.y);
    },
    [mouseRef],
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.set(9999, 9999);
  }, [mouseRef]);

  return (
    <mesh
      position={[0, 0, -1]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

const SvgParticleCanvas = ({
  svg,
  size = 400,
  density = 3,
  config = DEFAULT_CONFIG,
}: SvgParticleCanvasProps) => {
  const [points, setPoints] = useState<Point2D[]>([]);
  const mouseRef = useRef(new THREE.Vector2(9999, 9999));

  useEffect(() => {
    svgToPoints(svg, size, density).then(setPoints).catch(console.error);
  }, [svg, size, density]);

  if (points.length === 0) return null;

  return (
    <div style={{ width: size, height: size }} className="cursor-crosshair">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 100], near: 0.1, far: 1000 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <JsonEventPlane size={size} mouseRef={mouseRef} />
        <ParticleField
          key={points.length}
          points={points}
          mouseRef={mouseRef}
          config={config}
        />
      </Canvas>
    </div>
  );
};

export default SvgParticleCanvas;
