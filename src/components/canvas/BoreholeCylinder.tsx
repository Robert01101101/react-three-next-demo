import * as THREE from 'three';
import { Mesh, CylinderGeometry, MeshStandardMaterial, SphereGeometry } from 'three';
import { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';

export const BoreholeCylinder = ({ segments, totalDepth, isHovered, boreholeData }) => {
  const cylinderGroupRef = useRef(new THREE.Group());
  const raycasterRef = useRef(new THREE.Raycaster());
  const { camera, mouse, scene } = useThree();
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 }); // Yellow outline
  let currentOutline = null; // Variable to store the current outline

  console.log('Borehole Data:', boreholeData);

  // Memoize the creation of the cylinders and sphere
  const cylinderGroup = useMemo(() => {
    const group = new THREE.Group();
    const heightScale = 1 / totalDepth;

    // Add the borehole segments
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

      // Create a LOD object for this segment
      const lod = new THREE.LOD();
      lod.addLevel(highResMesh, 1.5); // Show high resolution when close
      lod.addLevel(lowResMesh, 3); // Show low resolution when further away

      // Add the LOD object to the group
      group.add(lod);
    });

    // Add a sphere at the top of the borehole
    const topSegment = segments[0];
    const topPositionY = -topSegment.from * heightScale; // Topmost position
    const sphereGeometry = new SphereGeometry(0.03, 4, 8); // Sphere geometry
    const sphereMaterial = new MeshStandardMaterial({ color: 0x888888 });
    const sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.y = topPositionY + 0.03; // Place sphere above topmost segment
    sphereMesh.userData = { boreholeData }; // Attach borehole data to the sphere

    // Add the sphere to the group
    group.add(sphereMesh);

    return group;
  }, [segments, totalDepth, boreholeData]);

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

        // Check if the sphere is hovered
         if (intersectedObject instanceof THREE.Mesh && intersectedObject.geometry instanceof THREE.SphereGeometry) {
          console.log('Borehole Data:', intersectedObject.userData.boreholeData);
          const segmentData = intersectedObject.userData.boreholeData;
          if (segmentData) {
            // Only show the tooltip if this specific cylinder is hovered
            if (isHovered) {
              tooltip.innerHTML = `
              <table>
                <tr>
                  <td>Name</td>
                  <td>${boreholeData.Name}</td>
                </tr>
                <tr>
                  <td>Source ID</td>
                  <td>${boreholeData.Source_ID}</td>
                </tr>
                <tr>
                  <td>Alias</td>
                  <td>${boreholeData.Alias1 || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Date Drilled</td>
                  <td>${boreholeData.Date_Drilled || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Depth Reference</td>
                  <td>${boreholeData.Depth_Reference || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Elevation (masl)</td>
                  <td>${boreholeData.El_DR_masl || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Elevation Method</td>
                  <td>${boreholeData.Elev_Method || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Total Depth (m)</td>
                  <td>${boreholeData.Total_Depth_m || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Easting (10TM83)</td>
                  <td>${boreholeData.E_10TM83 || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Northing (10TM83)</td>
                  <td>${boreholeData.N_10TM83 || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Latitude (NAD83)</td>
                  <td>${boreholeData.Lat_NAD83 || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Longitude (NAD83)</td>
                  <td>${boreholeData.Long_NAD83 || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Source CRS</td>
                  <td>${boreholeData.Source_CRS || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Drilling Company</td>
                  <td>${boreholeData.Drilling_Company || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Drilling Method</td>
                  <td>${boreholeData.Drilling_Method || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Driller</td>
                  <td>${boreholeData.Driller || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Logger</td>
                  <td>${boreholeData.Logger || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Owner</td>
                  <td>${boreholeData.Owner || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Well Presence</td>
                  <td>${boreholeData.Well_Presence || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Spatial Precision</td>
                  <td>${boreholeData.Spatial_Precision || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Georef</td>
                  <td>${boreholeData.Georef || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Folder</td>
                  <td>${boreholeData.Folder || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Log PDF</td>
                  <td><a href="${boreholeData.LogPDF || '#'}">View Log</a></td>
                </tr>
                <tr>
                  <td>Purpose</td>
                  <td>${boreholeData.Purpose || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Comment</td>
                  <td>${boreholeData.Comment || 'N/A'}</td>
                </tr>
              </table>`;
            tooltip.style.display = 'block';
            }
          } 
        }

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
  }, [camera, mouse, isHovered]);

  return <primitive object={cylinderGroupRef.current} />;
};