import * as THREE from 'three';
import { Mesh, CylinderGeometry, MeshStandardMaterial } from 'three';
import { useRef, useEffect } from 'react';

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
  const cylinderGroupRef = useRef(new THREE.Group());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const handleMouseMove = (event: MouseEvent) => {
    // Update mouse coordinates
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Perform raycasting to detect hover
    const checkForHover = () => {
      if (!cylinderGroupRef.current) return;

      raycasterRef.current.setFromCamera(mouseRef.current, new THREE.PerspectiveCamera());
      const intersects = raycasterRef.current.intersectObjects(cylinderGroupRef.current.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const segmentData = intersectedObject.userData.segmentData;
        if (segmentData) {
          console.log("Hovered Segment Data:", segmentData);
        }
      }
    };

    const animate = () => {
      checkForHover();
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Calculate the total height of the cylinder based on the borehole depth
  const heightScale = 1 / totalDepth;

  // Create each segment
  segments.forEach((segment, i) => {
    const segmentHeight = (segment.to - segment.from) * heightScale;
    const geometry = new CylinderGeometry(0.025, 0.025, segmentHeight, 32);
    const material = new MeshStandardMaterial({ color: segment.color });

    const segmentMesh = new Mesh(geometry, material);
    segmentMesh.position.y = -segment.from * heightScale - segmentHeight / 2;
    segmentMesh.userData = { segmentData: segment }; // Attach segment data for hover

    cylinderGroupRef.current.add(segmentMesh);
  });

  return <primitive object={cylinderGroupRef.current} />;
};
