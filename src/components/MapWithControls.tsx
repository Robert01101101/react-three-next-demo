'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

// Dynamically import necessary components
const MapPlaneAndBoreholes = dynamic(() => import('@/components/canvas/MapPlaneAndBoreholes').then(mod => mod.MapPlaneAndBoreholes), { ssr: false });
const View = dynamic(() => import('@/components/canvas/View').then(mod => mod.View), { ssr: false });
const Common = dynamic(() => import('@/components/canvas/View').then(mod => mod.Common), { ssr: false });

export default function MapWithControls() {
  const [opacity, setOpacity] = useState(1); // State to control map opacity

  return (
    <div className="w-100 relative h-screen">
      {/* Three.js View */}
      <View orbit className="size-full">
        <Suspense fallback={null}>
          <MapPlaneAndBoreholes opacity={opacity} />
          <Common />
        </Suspense>
      </View>

      {/* Slider control for opacity */}
      <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-md bg-gray-700 p-2 text-white opacity-90 shadow">
        <label htmlFor="opacity" className="block text-center text-sm font-medium text-white">
          Map Opacity
        </label>
        <input
          id="opacity"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="mt-1 w-full"
        />
      </div>

      {/* Borehole mouse hover tooltip */}
      <div id="tooltip" className="pointer-events-none absolute hidden rounded bg-gray-700 px-2 py-1 text-white opacity-90" />
    </div>
  );
}
