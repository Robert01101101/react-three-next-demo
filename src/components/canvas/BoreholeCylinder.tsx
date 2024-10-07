import * as THREE from 'three';
import { Mesh, CylinderGeometry, MeshStandardMaterial } from 'three';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const BoreholeCylinder = ({ segments, totalDepth }) => {
  const cylinderGroupRef = useRef(new THREE.Group());
  const raycasterRef = useRef(new THREE.Raycaster());
  const { camera, mouse, scene } = useThree();
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 }); // Yellow outline
  let currentOutline = null; // Variable to store the current outline

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
          tooltip.innerHTML = `
            <table>
              <tr>
                <td>From Depth (mbgs)</td>
                <td>${segmentData.from} m</td>
              </tr>
              <tr>
                <td>To Depth (mbgs)</td>
                <td>${segmentData.to} m</td>
              </tr>
              <tr>
                <td>Material</td>
                <td>${segmentData.pri_material}</td>
              </tr>
              <tr>
                <td>Secondary Material</td>
                <td>${segmentData.sec_material}</td>
              </tr>
              <tr>
                <td>Color</td>
                <td>${segmentData.color_label}</td>
              </tr>
              <tr>
                <td>Full_Text</td>
                <td>${segmentData.full_text}</td>
              </tr>
              <tr>
                <td>Comment</td>
                <td>${segmentData.comment}</td>
              </tr>
            </table>`;
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

    const onMouseClick = () => {
      // Update raycaster to find clicked objects
      raycasterRef.current.setFromCamera(mouse, camera);
      const intersects = raycasterRef.current.intersectObjects(cylinderGroupRef.current.children);

      if (intersects.length > 0) {
        const selectedSegment = intersects[0].object;

        // Remove the current outline if it exists
        if (currentOutline) {
          scene.remove(currentOutline);
        }

        // Create edges geometry for the selected borehole segment
        const edges = new THREE.EdgesGeometry(selectedSegment.geometry);
        currentOutline = new THREE.LineSegments(edges, outlineMaterial);
        
        // Set the position to match the original segment
        currentOutline.position.copy(selectedSegment.position);
        
        // Add the outline to the scene
        scene.add(currentOutline);
      } else {
        // If nothing is selected, remove the outline
        if (currentOutline) {
          scene.remove(currentOutline);
          currentOutline = null; // Reset current outline
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick); // Add click event listener

    const animate = () => {
      checkForHover();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick); // Clean up click event listener
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
