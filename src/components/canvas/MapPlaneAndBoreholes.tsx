import { useState, useCallback } from 'react';
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
  const { segmentData, boreholeData } = useBoreholeData(segmentsCsvUrl, boreholeCsvUrl);

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

  // Memoized handlers to prevent unnecessary re-renders
  const handlePointerOver = useCallback((index) => {
    setHoveredCylinderIndex(index);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredCylinderIndex(null);
  }, []);

  return (
    <>
      <MapSurface opacity={opacity} />
      {Object.entries(boreholeSegments).map(([boreholeName, segments], index) => {
        console.log('Borehole Name:', boreholeName);

        // Find the corresponding borehole data using the borehole name
        const correspondingBorehole = boreholeData.find(borehole => 
          borehole.Name.trim().toLowerCase() === boreholeName.trim().toLowerCase()
        );

        if (!correspondingBorehole) {
          console.warn(`No corresponding borehole data found for ${boreholeName}`);
        }

        return (
          <mesh
            key={index}
            position={[index * 0.1, 0, 0]}
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
