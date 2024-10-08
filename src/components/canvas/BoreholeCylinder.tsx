import * as THREE from 'three';
import { Mesh, CylinderGeometry, MeshStandardMaterial } from 'three';
import { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';

export const BoreholeCylinder = ({ segments, totalDepth, isHovered }) => {
  const cylinderGroupRef = useRef(new THREE.Group());
  const raycasterRef = useRef(new THREE.Raycaster());
  const { camera, mouse, scene } = useThree();
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 }); // Yellow outline
  let currentOutline = null; // Variable to store the current outline

  // Memoize the creation of the cylinders to prevent re-creation on each render
  const cylinderGroup = useMemo(() => {
    const group = new THREE.Group();

    const heightScale = 1 / totalDepth;

    segments.forEach((segment) => {
      const segmentHeight = (segment.to - segment.from) * heightScale;

      // Create high-resolution geometry
      const highResGeometry = new CylinderGeometry(0.025, 0.025, segmentHeight, 16);
      const highResMaterial = new MeshStandardMaterial({ color: segment.color });
      const highResMesh = new Mesh(highResGeometry, highResMaterial);
      highResMesh.position.y = -segment.from * heightScale - segmentHeight / 2;
      highResMesh.userData = { segmentData: segment };

      // Create low-resolution geometry
      const lowResGeometry = new CylinderGeometry(0.025, 0.025, segmentHeight, 4);
      const lowResMaterial = new MeshStandardMaterial({ color: segment.color });
      const lowResMesh = new Mesh(lowResGeometry, lowResMaterial);
      lowResMesh.position.y = -segment.from * heightScale - segmentHeight / 2;
      lowResMesh.userData = { segmentData: segment };

      console.log('adding segment', segment);

      // Create a LOD object for this segment
      const lod = new THREE.LOD();
      lod.addLevel(highResMesh, 1.5); // Show high resolution when close
      lod.addLevel(lowResMesh, 3); // Show low resolution when further away

      // Add the LOD object to the group
      group.add(lod);
    });

    return group;
  }, [segments, totalDepth]); // Only recompute if segments or totalDepth changes

  // Add the memoized group to the scene
  useEffect(() => {
    cylinderGroupRef.current.add(cylinderGroup);
    return () => {
      cylinderGroupRef.current.remove(cylinderGroup); // Clean up the group when unmounting
    };
  }, [cylinderGroup]);

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
          // Only show the tooltip if this specific cylinder is hovered
          if (isHovered) {
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
        } 
      } else {
        // Hide tooltip if no intersection is detected
        if (!isHovered) {
          tooltip.style.display = 'none';
        }
      }
    };

    const onMouseMove = (event) => {
      if (tooltip) {
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
      }
    };

    const onMouseClick = () => {
      return;
      //Disabled for now
      /*
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
        
        // Get world position of the selected segment
        const worldPosition = new THREE.Vector3();
        selectedSegment.getWorldPosition(worldPosition);
        
        // Set the outline position to the world position
        currentOutline.position.copy(worldPosition);
        
        // Add the outline to the scene
        scene.add(currentOutline);
      } else {
        // If nothing is selected, remove the outline
        if (currentOutline) {
          scene.remove(currentOutline);
          currentOutline = null; // Reset current outline
        }
      }*/
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
  }, [camera, mouse, isHovered]); // Add isHovered to dependencies

  return <primitive object={cylinderGroupRef.current} />;
};
