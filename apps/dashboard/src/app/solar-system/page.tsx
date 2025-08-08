"use client";

import { useEffect, useState } from "react";
import { SolarSystem } from "@repo/performance-tools";
import { createDemoSolarSystemData } from "@repo/performance-tools";
import type {
  SolarSystemData,
  SolarSystemConfig,
} from "@repo/performance-tools";

export default function SolarSystemPage() {
  const [solarSystemData, setSolarSystemData] =
    useState<SolarSystemData | null>(null);
  const [config, setConfig] = useState<SolarSystemConfig | null>(null);

  useEffect(() => {
    // Load demo data
    const { solarSystemData: demoData, config: demoConfig } =
      createDemoSolarSystemData();
    setSolarSystemData(demoData);
    setConfig(demoConfig);
  }, []);

  if (!solarSystemData || !config) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Solar System...
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <SolarSystem
        data={solarSystemData}
        config={config}
        onPlanetSelect={(planet) => console.log("Selected planet:", planet)}
      />
    </div>
  );
}
