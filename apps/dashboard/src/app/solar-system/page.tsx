"use client";

import { useEffect, useState } from "react";
import {
  createDemoSolarSystemData,
  SolarSystemConfig,
  SolarSystemData,
  PlanetData,
} from "@repo/performance-lib";
import dynamic from "next/dynamic";

const DynamicSolarSystem = dynamic(
  () =>
    import("@repo/performance-lib").then((mod) => ({
      default: mod.SolarSystem,
    })),
  {
    ssr: false,
  }
);

export default function SolarSystemPage() {
  const [solarSystemData, setSolarSystemData] =
    useState<SolarSystemData | null>(null);
  const [config, setConfig] = useState<SolarSystemConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load demo data
    const { solarSystemData: demoData, config: demoConfig } =
      createDemoSolarSystemData();
    setSolarSystemData(demoData);
    setConfig(demoConfig);
  }, []);

  if (!mounted || !solarSystemData || !config) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Solar System...
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <DynamicSolarSystem
        data={solarSystemData}
        config={config}
        onPlanetSelect={(planet: PlanetData) =>
          console.log("Selected planet:", planet)
        }
      />
    </div>
  );
}
