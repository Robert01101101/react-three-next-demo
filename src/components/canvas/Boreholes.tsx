import { BoreholeCylinder } from './BoreholeCylinder';

interface BoreholesProps {
  boreholeSegments: any[];
}

export function Boreholes({ boreholeSegments }: BoreholesProps) {
  return (
    <mesh position={[0, 0, 0]}>
      <BoreholeCylinder segments={boreholeSegments} totalDepth={25.3} />
    </mesh>
  );
}
