'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Html } from '@react-three/drei';
import { Mesh } from 'three';
import type { PlanetData } from '../../types/solarSystem';
import { formatFileSize } from '../../utils/bundleParser';

type PlanetProps = {
  data: PlanetData;
  showTooltips: boolean;
  enableAnimation: boolean;
  onClick?: (data: PlanetData) => void;
  onHover?: (data: PlanetData | null) => void;
};

export const Planet = ({ 
  data, 
  showTooltips, 
  enableAnimation, 
  onClick, 
  onHover 
}: PlanetProps) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate initial angle from the original position
  const initialAngle = Math.atan2(data.position.z, data.position.x);
  
  // Animation: orbit around center maintaining initial offset
  useFrame((state) => {
    if (!meshRef.current || !enableAnimation) return;
    
    const time = state.clock.elapsedTime;
    const currentAngle = initialAngle + (time * data.orbitSpeed);
    const x = Math.cos(currentAngle) * data.orbitRadius;
    const z = Math.sin(currentAngle) * data.orbitRadius;
    
    meshRef.current.position.set(x, 0, z);
    
    // Add gentle rotation
    meshRef.current.rotation.y = time * 0.5;
  });

  const handlePointerOver = () => {
    setIsHovered(true);
    onHover?.(data);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  const handleClick = () => {
    onClick?.(data);
  };

  const planetScale = isHovered ? data.size * 1.2 : data.size;
  const planetOpacity = isHovered ? 0.9 : 0.8;

  return (
    <group>
      {/* Planet sphere */}
      <Sphere
        ref={meshRef}
        args={[planetScale, 32, 32]}
        position={enableAnimation ? undefined : [data.position.x, data.position.y, data.position.z]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={data.color}
          transparent
          opacity={planetOpacity}
          metalness={0.7}
          roughness={0.3}
          emissive={data.color}
          emissiveIntensity={isHovered ? 0.2 : 0.1}
        />
      </Sphere>

      {/* Planet name label */}
      <Text
        position={[
          data.position.x,
          data.position.y + data.size + 0.5,
          data.position.z
        ]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {data.name}
      </Text>

      {/* Hover tooltip */}
      {isHovered && showTooltips && (
        <Html
          position={[data.position.x, data.position.y + data.size + 1, data.position.z]}
          center
        >
          <div className="bg-black/80 text-white p-3 rounded-lg shadow-lg text-sm max-w-xs">
            <div className="font-semibold mb-1">{data.bundle.name}</div>
            <div className="text-xs space-y-1">
              <div>Size: {formatFileSize(data.bundle.size)}</div>
              <div>Gzipped: {formatFileSize(data.bundle.gzipSize)}</div>
              <div>Type: {data.bundle.type}</div>
              <div>Modules: {data.bundle.modules.length}</div>
            </div>
          </div>
        </Html>
      )}

      {/* Orbit path visualization */}
      {enableAnimation && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[data.orbitRadius - 0.05, data.orbitRadius + 0.05, 64]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.3}
            side={2}
          />
        </mesh>
      )}
    </group>
  );
};