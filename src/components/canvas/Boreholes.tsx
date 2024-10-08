import { useState } from 'react';
import { BoreholeCylinder } from './BoreholeCylinder';

interface BoreholesProps {
  boreholeSegments: any[][];
}

export function Boreholes({ boreholeSegments }: BoreholesProps) {
  const [hoveredCylinderIndex, setHoveredCylinderIndex] = useState<number | null>(null); // Track hovered index

  return (
    <>
      {boreholeSegments.map((segments, index) => (
        <mesh key={index} position={[index * 0.1, 0, 0]} onPointerOver={() => setHoveredCylinderIndex(index)} onPointerOut={() => setHoveredCylinderIndex(null)}> 
          <BoreholeCylinder segments={segments} totalDepth={25.3} isHovered={hoveredCylinderIndex === index} />
        </mesh>
      ))}
    </>
  );
}
