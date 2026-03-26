"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function FloatingParticles() {
  const ref = useRef<any>(null);
  
  // We use Float32Array for performance
  const [sphere] = useState(() => {
    const points = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = 1.5 * Math.sin(phi) * Math.cos(theta);
      const y = 1.5 * Math.sin(phi) * Math.sin(theta);
      const z = 1.5 * Math.cos(phi);
      points.set([x, y, z], i * 3);
    }
    return points;
  });

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FloatingParticles />
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}