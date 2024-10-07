import * as THREE from 'three';
import { useState, useEffect, useRef } from 'react';

interface MapSurfaceProps {
  opacity: number; // Prop to control the opacity
}

export function MapSurface({ opacity }: MapSurfaceProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Calculate tile coordinates for Britannia Mine Museum
  const latitude = 49.62240163192287;
  const longitude = -123.2036210549935;
  const zoomLevel = 14;
  const [xTile, yTile] = latLonToTile(latitude, longitude, zoomLevel);

  const tileUrl = `https://a.tile.openstreetmap.org/${zoomLevel}/${xTile}/${yTile}.png`;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(tileUrl, (loadedTexture) => {
      setTexture(loadedTexture);
      if (materialRef.current) {
        materialRef.current.map = loadedTexture;
        materialRef.current.needsUpdate = true;
      }
    }, undefined, (error) => {
      console.error('Error loading texture:', error);
    });
  }, [tileUrl]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, Math.PI]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="white"
        side={THREE.DoubleSide}
        transparent={true}
        opacity={opacity}  // Apply opacity here
      />
    </mesh>
  );
}

function latLonToTile(lat: number, lon: number, zoom: number): [number, number] {
  const n = Math.pow(2, zoom);
  const xTile = Math.floor((lon + 180) / 360 * n);
  const yTile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + (1 / Math.cos(lat * Math.PI / 180))) / Math.PI) / 2 * n);
  return [xTile, yTile];
}