import * as THREE from 'three';
import { useState, useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';

interface MapSurfaceProps {
  opacity: number;
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export function MapSurface({ opacity, minLat, minLon, maxLat, maxLon }: MapSurfaceProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [realBounds, setRealBounds] = useState<{ minLat: number, maxLat: number, minLon: number, maxLon: number } | null>(null);

  // Step 1: Calculate the maximum distance from lat/lon bounds
  const maxDistance = getMaxBounds(minLat, maxLat, minLon, maxLon);

  // Step 2: Determine the appropriate zoom level based on the max distance
  const zoomLevel = getZoomLevelForDistance(maxDistance);

  // Step 3: Calculate the tile coordinates for the center of the bounds
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;
  const [xTile, yTile] = latLonToTile(centerLat, centerLon, zoomLevel);

  // Step 4: Fetch the OSM tile and store the real lat/lon bounds
  const tileUrl = `https://a.tile.openstreetmap.org/${zoomLevel}/${xTile}/${yTile}.png`;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(tileUrl, (loadedTexture) => {
      setTexture(loadedTexture);
      if (materialRef.current) {
        materialRef.current.map = loadedTexture;
        materialRef.current.needsUpdate = true;
      }

      // Calculate and set the real bounds of the loaded tile
      const tileBounds = getTileBounds(xTile, yTile, zoomLevel);
      setRealBounds(tileBounds);
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
      {realBounds && (
      <>
        {/* Max Latitude at Top Edge */}
        <Text
          position={[0, 0.55, 0.02]} // Centered on the top edge
          fontSize={0.05} // Smaller font size
          color="black"
        >
          MaxLat: {realBounds.maxLat.toFixed(6)}
        </Text>

        {/* Min Latitude at Bottom Edge */}
        <Text
          position={[0, -0.55, 0.02]} // Centered on the bottom edge
          fontSize={0.05} // Smaller font size
          color="black"
        >
          MinLat: {realBounds.minLat.toFixed(6)}
        </Text>

        {/* Max Longitude at Right Edge */}
        <Text
          position={[0.55, 0, 0.02]} // Centered on the right edge
          fontSize={0.05} // Smaller font size
          color="black"
          anchorX="left" // Align text to the left
        >
          MaxLong: {realBounds.maxLon.toFixed(6)}
        </Text>

        {/* Min Longitude at Left Edge */}
        <Text
          position={[-0.55, 0, 0.02]} // Centered on the left edge
          fontSize={0.05} // Smaller font size
          color="black"
          anchorX="right" // Align text to the right
        >
          MinLong: {realBounds.minLon.toFixed(6)}
        </Text>
      </>
    )}
    </mesh>
  );
}

// Helper function to calculate max bounds
function getMaxBounds(minLat: number, maxLat: number, minLon: number, maxLon: number): number {
  const latDiff = Math.abs(maxLat - minLat);
  const lonDiff = Math.abs(maxLon - minLon);
  return Math.max(latDiff, lonDiff);  // Return the larger of the two distances
}

// Helper function to determine zoom level based on max distance
function getZoomLevelForDistance(maxDistance: number): number {
  const zoom = Math.floor(8 - Math.log2(maxDistance)); // Approximation formula
  return Math.max(0, Math.min(zoom, 19));  // Clamp between zoom levels 0 and 19
}

// Helper function to convert lat/lon to OSM tile coordinates
function latLonToTile(lat: number, lon: number, zoom: number): [number, number] {
  const n = Math.pow(2, zoom);
  const xTile = Math.floor((lon + 180) / 360 * n);
  const yTile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + (1 / Math.cos(lat * Math.PI / 180))) / Math.PI) / 2 * n);
  return [xTile, yTile];
}

// Helper function to get the real lat/lon bounds of an OSM tile
function getTileBounds(xTile: number, yTile: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const lonMin = (xTile / n) * 360 - 180;
  const latMin = Math.atan(Math.sinh(Math.PI * (1 - 2 * yTile / n))) * 180 / Math.PI;
  const lonMax = ((xTile + 1) / n) * 360 - 180;
  const latMax = Math.atan(Math.sinh(Math.PI * (1 - 2 * (yTile + 1) / n))) * 180 / Math.PI;
  return { minLat: latMin, maxLat: latMax, minLon: lonMin, maxLon: lonMax };
}
