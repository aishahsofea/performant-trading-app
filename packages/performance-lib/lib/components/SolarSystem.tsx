"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { Planet } from "./Planet";
import type {
  SolarSystemData,
  PlanetData,
  SolarSystemConfig,
} from "../types/solarSystem";
import { formatFileSize } from "../utils/bundleParser";

// Sun component with bright emissive material for bloom effect
const Sun = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        color="orange"
        emissive="orange"
        emissiveIntensity={4}
      />
    </mesh>
  );
};

type SolarSystemProps = {
  data: SolarSystemData;
  config: SolarSystemConfig;
  onPlanetSelect?: (planet: PlanetData) => void;
  className?: string;
};

export const SolarSystem = ({
  data,
  config,
  onPlanetSelect,
  className = "",
}: SolarSystemProps) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);

  const handlePlanetClick = (planet: PlanetData) => {
    onPlanetSelect?.(planet);
  };

  const handlePlanetHover = (planet: PlanetData | null) => {
    setHoveredPlanet(planet);
  };

  return (
    <div
      className={`w-full h-full relative ${className}`}
      style={{ height: "100vh" }}
    >
      <Canvas
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          {/* Camera */}x
          <PerspectiveCamera makeDefault position={[15, 3, 10]} fov={130} />
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={config.cameraAutoRotate}
            autoRotateSpeed={0.5}
            minDistance={5}
            maxDistance={50}
          />
          {/* Lighting - realistic solar system lighting */}
          <color attach="background" args={["#111"]} />
          <ambientLight intensity={0.2} color="#101012" />
          <pointLight
            position={[0, 0, 0]}
            intensity={5}
            color="#FFFFFF"
            distance={0}
            decay={1}
          />
          {/* Space background */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          {/* Central sun (representing the main application) */}
          <Sun />
          {/* Planets representing bundles */}
          {data.planets.map((planet) => (
            <Planet
              key={planet.id}
              data={planet}
              showTooltips={config.showTooltips}
              enableAnimation={config.enableAnimation}
              onClick={handlePlanetClick}
              onHover={handlePlanetHover}
            />
          ))}
          {/* Post-processing effects for sun glow */}
          <EffectComposer disableNormalPass>
            <Bloom
              mipmapBlur
              luminanceThreshold={1.0}
              levels={5}
              intensity={0.5}
            />
            <ToneMapping />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Performance overlay */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Bundle Analysis</h3>
        <div className="space-y-1 text-sm">
          <div>Total Size: {formatFileSize(data.totalSize)}</div>
          <div>Bundles: {data.planets.length}</div>
          <div>Phase: {config.currentPhase}</div>
          {hoveredPlanet && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div className="font-medium">{hoveredPlanet.name}</div>
              <div>{formatFileSize(hoveredPlanet.bundle.size)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Bundle Types</h3>
        <div className="space-y-2 text-sm">
          <LegendItem color="#4F46E5" label="Main" />
          <LegendItem color="#10B981" label="Chunks" />
          <LegendItem color="#F59E0B" label="Vendor" />
          <LegendItem color="#EF4444" label="CSS" />
          <LegendItem color="#8B5CF6" label="Assets" />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg">
        <div className="flex flex-wrap gap-2 text-sm">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Click planets for details</div>
        </div>
      </div>
    </div>
  );
};

type LegendItemProps = {
  color: string;
  label: string;
};

const LegendItem = ({ color, label }: LegendItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
};
