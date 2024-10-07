'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

// Dynamically import necessary components
const MapPlaneAndBoreholes = dynamic(() => import('@/components/canvas/MapPlaneAndBoreholes').then(mod => mod.MapPlaneAndBoreholes), { ssr: false });
const View = dynamic(() => import('@/components/canvas/View').then(mod => mod.View), { ssr: false });
const Common = dynamic(() => import('@/components/canvas/View').then(mod => mod.Common), { ssr: false });

export default function MapWithControls() {
  const [opacity, setOpacity] = useState(1); // State to control map opacity
  const [isMovementDetected, setIsMovementDetected] = useState(false); // State to track movement detection
  const [resetTriggered, setResetTriggered] = useState(false); // State to track if reset button was pressed


  const handleMovementDetected = () => {
    //console.log('movementDetectedInParent');
    setIsMovementDetected(true); // Set state to true when movement is detected
  };

  const handleReset = () => {
    setIsMovementDetected(false); // Reset movement detection state
    console.log('handleReset Parent');
    setResetTriggered(true); // Trigger reset event
  };

  // Reset `resetTriggered` state after it has been passed to View
  useEffect(() => {
    if (resetTriggered) {
      setResetTriggered(false); // Reset after triggering the event
    }
  }, [resetTriggered]);

  return (
    <div className="w-100 relative h-screen">
      {/* Three.js View */}
       <View
        orbit
        onMovementDetected={handleMovementDetected}
        onReset={resetTriggered ? handleReset : undefined} // Pass onReset only when resetTriggered is true
        className="size-full"
      >
        <Suspense fallback={null}>
          <MapPlaneAndBoreholes opacity={opacity} />
          <Common color="#f3f2f1" />
        </Suspense>
      </View>

      {/* Borehole mouse hover tooltip */}
      <div id="tooltip" className="pointer-events-none absolute hidden rounded bg-gray-700 px-2 py-1 text-white opacity-90" />

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

      {/* Reset Button */}
      {isMovementDetected && (
        <button
          onClick={handleReset}
          className="absolute right-4 top-4 z-20 rounded-full bg-gray-700 p-3 text-white opacity-90 shadow hover:bg-gray-500"
        >
          <svg width="2rem" height="2rem" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(0 1 1 0 2.5 2.5)">
            <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
            <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>
            </g>
          </svg>
        </button>

      )}
    </div>
  );
}
