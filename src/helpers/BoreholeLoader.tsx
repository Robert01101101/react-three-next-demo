import { useState, useEffect } from 'react';
import * as d3 from 'd3';

// Type definition for the borehole interval
interface BoreholeInterval {
  Borehole_Name: string;
  From_Depth_mbgs: number;
  To_Depth_mbgs: number;
  Pri_Material: string;
  Sec_Material?: string;  // Add Secondary Material (optional)
  Colour: string;
  Colour_Label: string;
  Full_Text?: string;     // Add Full Text (optional)
  Comment?: string;       // Add Comment (optional)
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
  d3.csv(csvUrl, d => {
    if (d['Borehole_Name'] === '1') {
      return {
        Borehole_Name: d['Borehole_Name'] as string,
        From_Depth_mbgs: +d['From_Depth_mbgs'],
        To_Depth_mbgs: +d['To_Depth_mbgs'],
        Pri_Material: d['Pri_Material'] as string,
        Sec_Material: d['Sec_Material'] as string || '',  // Handle missing data
        Colour: mapColor(d['Colour'] as string),
        Colour_Label: d['Colour'] as string,
        Full_Text: d['Full_Text'] as string || '',        // Handle missing data
        Comment: d['Comment'] as string || '',            // Handle missing data
      };
    }
    return null; // Return null for rows you want to skip
  })
  .then(data => {
    const filteredData = data.filter(d => d !== null) as BoreholeInterval[];
    setBoreholeData(filteredData);
  })
  .catch(error => {
    console.error("Error loading CSV data:", error);
  });
  }, [csvUrl]);


  return boreholeData;
};
