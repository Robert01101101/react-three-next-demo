import { useState, useEffect } from 'react';
import * as d3 from 'd3';

// Type definition for the borehole interval
interface BoreholeInterval {
  Borehole_Name: string;
  From_Depth_mbgs: number;
  To_Depth_mbgs: number;
  Pri_Material: string;
  Colour: string;
}

const colorMap: { [key: string]: string } = {
  "grey": "#aaaaaa",
  "grey - dark grey": "#888888",
  "dark grey": "#555555",
  "grey (bluish)": "#aaaacc",
  // Add more mappings as needed
};

const mapColor = (color: string): string => {
  console.log("Color:", color);
  return colorMap[color.toLowerCase()] || '#FFFFFF'; // Default to white if color is not mapped
};

export const useBoreholeData = (csvUrl: string) => {
  const [boreholeData, setBoreholeData] = useState<BoreholeInterval[]>([]);

  useEffect(() => {
    // Load the CSV data, filtering rows during the parsing step
    d3.csv(csvUrl, d => {
      // Filter directly in the conversion function to skip rows not needed
      if (d['Borehole_Name'] === '1') {
        return {
          Borehole_Name: d['Borehole_Name'] as string,
          From_Depth_mbgs: +d['From_Depth_mbgs'],
          To_Depth_mbgs: +d['To_Depth_mbgs'],
          Pri_Material: d['Pri_Material'] as string,
          Colour: mapColor(d['Colour'] as string),
        };
      }
      return null; // Return null for rows you want to skip
    })
    .then(data => {
      // Filter out null values that were returned for skipped rows
      const filteredData = data.filter(d => d !== null) as BoreholeInterval[];
      setBoreholeData(filteredData);
    })
    .catch(error => {
      console.error("Error loading CSV data:", error);
    });
  }, [csvUrl]);

  return boreholeData;
};
