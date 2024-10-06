import * as THREE from 'three';
import { Mesh, CylinderGeometry, MeshStandardMaterial } from 'three';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const BoreholeCylinder = ({ segments, totalDepth }) => {
  const cylinderGroupRef = useRef(new THREE.Group());
  const raycasterRef = useRef(new THREE.Raycaster());
  const { camera, mouse, scene } = useThree();

  useEffect(() => {
    const tooltip = document.getElementById('tooltip');
    
    const checkForHover = () => {
      if (!cylinderGroupRef.current || !tooltip) return;

      raycasterRef.current.setFromCamera(mouse, camera);

      const intersects = raycasterRef.current.intersectObjects(cylinderGroupRef.current.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const segmentData = intersectedObject.userData.segmentData;

        if (segmentData) {
          // Show tooltip with segment information
          tooltip.innerHTML = `Depth: ${segmentData.from}m to ${segmentData.to}m<br/>Color: ${segmentData.color}`;
          tooltip.style.display = 'block';
        }
      } else {
        tooltip.style.display = 'none';
      }
    };

    const onMouseMove = (event) => {
      if (tooltip) {
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      checkForHover();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [camera, mouse]);

  // Calculate the total height of the cylinder based on the borehole depth
  const heightScale = 1 / totalDepth;

  segments.forEach((segment) => {
    const segmentHeight = (segment.to - segment.from) * heightScale;
    const geometry = new CylinderGeometry(0.025, 0.025, segmentHeight, 32);
    const material = new MeshStandardMaterial({ color: segment.color });

    const segmentMesh = new Mesh(geometry, material);
    segmentMesh.position.y = -segment.from * heightScale - segmentHeight / 2;
    segmentMesh.userData = { segmentData: segment };

    cylinderGroupRef.current.add(segmentMesh);
  });

  return <primitive object={cylinderGroupRef.current} />;
};
