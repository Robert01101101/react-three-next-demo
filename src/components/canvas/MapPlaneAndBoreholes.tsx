//Learning Notes
//When you want a component to “remember” some information, but you don’t want that information to trigger new renders, you can use a ref.

'use client'

import * as THREE from 'three'
import { useState, useEffect, useRef } from 'react'

//New for boreholes
import { useBoreholeData } from 'src/helpers/BoreholeLoader';
import { BoreholeCylinder } from './BoreholeCylinder';
const boreholeCsvUrl = '/DIG_2014_0012/Intervals.csv';


export function MapPlaneAndBoreholes(props) {
  //map texture
  const [texture, setTexture] = useState<THREE.Texture | null>(null); // Specify the type for texture state
  const materialRef = useRef<THREE.MeshBasicMaterial>(null); // Create a ref for the material

  // Calculate tile coordinates for Britannia Mine Museum
  const latitude = 49.62240163192287;
  const longitude =  -123.2036210549935;
  const zoomLevel = 14;
  const [xTile, yTile] = latLonToTile(latitude, longitude, zoomLevel);

  // Construct the URL for the OpenStreetMap tile
  const tileUrl = `https://a.tile.openstreetmap.org/${zoomLevel}/${xTile}/${yTile}.png`;

  console.log(tileUrl, texture);
  
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(tileUrl, (loadedTexture) => {
      setTexture(loadedTexture); // Update state to trigger render
      if (materialRef.current) {
        materialRef.current.map = loadedTexture; // Directly set the map on the material
        materialRef.current.needsUpdate = true; // Mark the material for update
      }
    }, undefined, (error) => {
      console.error('Error loading texture:', error);
    });
  }, [tileUrl]);

  //NEW FOR BOREHOLE
  // Load borehole data
  const boreholeData = useBoreholeData(boreholeCsvUrl);

  // Convert borehole data to the format required by BoreholeCylinder
  const boreholeSegments = boreholeData.map((d) => ({
    from: d.From_Depth_mbgs,
    to: d.To_Depth_mbgs,
    color: d.Colour,
    color_label: d.Colour_Label,
    lithology: d.Pri_Material,
  }));

  return (
    <>
      <mesh {...props} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          ref={materialRef}
          color='white'
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh {...props} position={[0, 0, 0]}>
        <BoreholeCylinder segments={boreholeSegments} totalDepth={25.3} />
      </mesh>
    </>
  );
}

// Function to convert latitude and longitude to tile coordinates
function latLonToTile(lat: number, lon: number, zoom: number): [number, number] {
  const n = Math.pow(2, zoom);
  const xTile = Math.floor((lon + 180) / 360 * n);
  const yTile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + (1 / Math.cos(lat * Math.PI / 180))) / Math.PI) / 2 * n);
  return [xTile, yTile];
}