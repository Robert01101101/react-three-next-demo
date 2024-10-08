import { useState, useCallback, useEffect } from 'react';
import { MapSurface } from './MapSurface';
import { TransparencySlider } from './TransparencySlider';
import { useBoreholeData } from 'src/helpers/BoreholeLoader';
import { BoreholeCylinder } from './BoreholeCylinder'; // Import BoreholeCylinder directly

const segmentsCsvUrl = '/DIG_2014_0012/Intervals.csv';
const boreholeCsvUrl = '/DIG_2014_0012/Boreholes.csv';

interface MapPlaneAndBoreholesProps {
  opacity: number;
}

export function MapPlaneAndBoreholes({ opacity }: MapPlaneAndBoreholesProps) {
  // Load borehole and segment data
  const { segmentData, boreholeData, minLat, maxLat, minLong, maxLong } = useBoreholeData(segmentsCsvUrl, boreholeCsvUrl);

  console.log('Segment Data:', segmentData);
  console.log('Borehole Data:', boreholeData);
  console.log('Min Lat:', minLat);
  console.log('Max Lat:', maxLat);
  console.log('Min Long:', minLong);
  console.log('Max Long:', maxLong);

  // Group segments by Borehole_Name
  const boreholeSegments = segmentData.reduce((acc, d) => {
    const boreholeName = d.Borehole_Name;
    if (!acc[boreholeName]) {
      acc[boreholeName] = [];
    }
    acc[boreholeName].push({
      from: d.From_Depth_mbgs,
      to: d.To_Depth_mbgs,
      color: d.Colour,
      color_label: d.Colour_Label,
      pri_material: d.Pri_Material,
      sec_material: d.Sec_Material,
      full_text: d.Full_Text,
      comment: d.Comment,
    });
    return acc;
  }, {} as Record<string, any[]>);

  const [hoveredCylinderIndex, setHoveredCylinderIndex] = useState<number | null>(null); // Track hovered index
  const [realBounds, setRealBounds] = useState<{ minLat: number; maxLat: number; minLon: number; maxLon: number } | null>(null);

  // Memoized handlers to prevent unnecessary re-renders
  const handlePointerOver = useCallback((index) => {
    setHoveredCylinderIndex(index);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredCylinderIndex(null);
  }, []);

  // Update the real bounds based on the MapSurface's return
  const handleBoundsUpdate = (bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => {
    setRealBounds(bounds);
  };

  return (
    <>
      <MapSurface
        opacity={opacity}
        minLat={minLat}
        minLon={minLong}
        maxLat={maxLat}
        maxLon={maxLong}
        onBoundsUpdate={handleBoundsUpdate} // Pass down the callback
      />
      {realBounds && Object.entries(boreholeSegments).map(([boreholeName, segments], index) => {
        console.log('Borehole Name:', boreholeName);

        // Find the corresponding borehole data using the borehole name
        const correspondingBorehole = boreholeData.find(borehole =>
          borehole.Name.trim().toLowerCase() === boreholeName.trim().toLowerCase()
        );

        if (!correspondingBorehole) {
          console.warn(`No corresponding borehole data found for ${boreholeName}`);
          return null; // Skip rendering if no data is found
        }

        // Calculate normalized position based on real bounds
        const normalizedPosition: [number, number, number] = [
          (correspondingBorehole.Long_NAD83 - realBounds.minLon) / (realBounds.maxLon - realBounds.minLon) * 2 - 1.5, // Normalize to -1 to 1
          0, // Y position can be 0 or adjusted based on depth later
          (correspondingBorehole.Lat_NAD83 - realBounds.minLat) / (realBounds.maxLat - realBounds.minLat) * 2 - 1 // Normalize to -1 to 1
        ];

        return (
          <mesh
            key={index}
            position={normalizedPosition} // Use the calculated normalized position
            onPointerOver={() => handlePointerOver(index)}
            onPointerOut={handlePointerOut}
          >
            <BoreholeCylinder
              segments={segments}
              totalDepth={25.3}
              isHovered={hoveredCylinderIndex === index} // Pass the hover state
              boreholeData={correspondingBorehole} // Pass the corresponding borehole data
            />
          </mesh>
        );
      })}
    </>
  );
}
