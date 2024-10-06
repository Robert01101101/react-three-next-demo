// MapImage.tsx
'use client'

import { useState, useEffect } from 'react';

// Function to convert latitude and longitude to tile coordinates
function latLonToTile(lat: number, lon: number, zoom: number): [number, number] {
  const n = Math.pow(2, zoom);
  const xTile = Math.floor((lon + 180) / 360 * n);
  const yTile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + (1 / Math.cos(lat * Math.PI / 180))) / Math.PI) / 2 * n);
  return [xTile, yTile];
}

export function MapImage(props) {
  // Calculate tile coordinates for Vancouver
  const latitude = 49.62240163192287;
  const longitude =  -123.2036210549935;
  const zoomLevel = 14;
  const [xTile, yTile] = latLonToTile(latitude, longitude, zoomLevel);

  // Construct the URL for the OpenStreetMap tile
  const tileUrl = `https://a.tile.openstreetmap.org/${zoomLevel}/${xTile}/${yTile}.png`;

  console.log(tileUrl);
  
  return (
    <>
      {/* Debug: Show the image element to see if the tile loads correctly */}
      <img src={tileUrl} alt="Map Tile" style={{ width: '200px', height: 'auto' }} />
    </>
  );
}
