import * as THREE from 'three';
import { Mesh, CylinderGeometry, MeshStandardMaterial } from 'three';

interface BoreholeSegment {
  from: number;
  to: number;
  color: string;
}

interface BoreholeCylinderProps {
  segments: BoreholeSegment[];
  totalDepth: number;
}

export const BoreholeCylinder = ({ segments, totalDepth }: BoreholeCylinderProps) => {
  const cylinderGroup = new THREE.Group();

  // Calculate the total height of the cylinder based on the borehole depth
  const heightScale = 1 / totalDepth;

  // Create each segment
  segments.forEach((segment, i) => {
    const segmentHeight = (segment.to - segment.from) * heightScale;
    const geometry = new CylinderGeometry(0.05, 0.05, segmentHeight, 32);
    const material = new MeshStandardMaterial({ color: segment.color });

    const segmentMesh = new Mesh(geometry, material);
    segmentMesh.position.y = -segment.from * heightScale - segmentHeight / 2;
    cylinderGroup.add(segmentMesh);
  });

  return <primitive object={cylinderGroup} />;
};
