import { BoreholeCylinder } from './BoreholeCylinder';

interface BoreholesProps {
  boreholeSegments: any[][];
}

export function Boreholes({ boreholeSegments }: BoreholesProps) {
  return (
    <>
      {boreholeSegments.map((segments, index) => (
        <mesh key={index} position={[index * 0.1, 0, 0]}> {/* Adjust spacing as needed */}
          <BoreholeCylinder segments={segments} totalDepth={25.3} />
        </mesh>
      ))}
    </>
  );
}
