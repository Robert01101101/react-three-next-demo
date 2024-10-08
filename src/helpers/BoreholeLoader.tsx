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

//Mapped the first few myself, then used ChatGPT
const colorMap: { [key: string]: string } = {
  "grey": "#aaaaaa",
  "grey - dark grey": "#888888",
  "0": "#000000", // Assuming '0' is black
  "dark grey": "#555555",
  "Grey (bluish)": "#aaaacc",
  "brown": "#8B4513",
  "grey and yellow-brown": "#B2A95C",
  "brown grey": "#A69A8A",
  "greenish grey": "#B0BDA2",
  "grey-brown": "#8B7B6A",
  "dark brown to grey": "#4B3D3B",
  "brown yellow": "#D5B44E",
  "dark grey brown": "#4E4B4B",
  "brown green; grey": "#6F6A56",
  "dark grey -grey": "#666666",
  "grey brown": "#7D6E61",
  "brown and light yellow": "#C6A657",
  "grey to greenish grey": "#A6B8A1",
  "bluish grey": "#7A9BAE",
  "yellowish brown": "#BDAA5D",
  "yellow": "#FFFF00",
  "dark brown": "#3B2B2B",
  "yellow brown": "#A68A00",
  "light grey": "#D3D3D3",
  "brownish grey": "#B3A09D",
  "grey to dark grey": "#7B7B7B",
  "brown to dark grey": "#4B3D3B",
  "grey brown to green": "#7D6B4D",
  "brown and yellow grey": "#B8A75D",
  "green grey": "#A2B29D",
  "brown grey to grey": "#A69A8A",
  "light bluish grey": "#B0C4D9",
  "chocolate brown": "#5B3A29",
  "brown, grey": "#7D6E61",
  "bluish grey to brown": "#7A9BAE",
  "grey to dark brown grey": "#6B5757",
  "dark brown grey": "#4E4B4B",
  "brown and grey": "#A69A8A",
  "dark grey to grey": "#6B6B6B",
  "dark grey to green": "#4E5D5D",
  "bluish grey and green": "#A2B0B2",
  "grey and brown": "#7D6E61",
  "light olive grey": "#C0C0A9",
  "brown - grey": "#7D6E61",
  "grey to brown grey": "#7D6A54",
  "yellow and brown": "#D5A36D",
  "green": "#008000",
  "light yellow": "#FFFFE0",
  "brown, yellow": "#C6A657",
  "brown to grey to pale green": "#A4B56A",
  "brown to olive yellow": "#A7A53D",
  "blue grey": "#607B8B",
  "light brown": "#C2A161",
  "yellow brown and bluish grey": "#C6A657",
  "brown - yellow": "#D5B44E",
  "bluish grey to dark grey": "#6C7A8B",
  "brown-chocolate": "#7B4B3A",
  "grey brown to yellow brown": "#A68A4D",
  "bright brown": "#7C4B24",
  "grey, greenish grey": "#B3B8B4",
  "brown, light grey": "#B2A99E",
  "brown and yellow": "#D5A36D",
  "dark brown to light yellow": "#BF9B6B",
  "greenish grey and brown": "#B2B59B",
  "green and brown": "#8B5B29",
  "bluish grey to greenish grey": "#A2B8C2",
  "grey to olive grey": "#A8A688",
  "grey to light grey": "#D3D3D3",
  "grey, light bluish": "#A0B2C0",
  "brown to dark brown": "#4B3D3B",
  "greenish grey to light grey": "#C1D1C1",
};


const mapColor = (color: string): string => {
  console.log("Color:", color);
  return colorMap[color.toLowerCase()] || '#FFFFFF'; // Default to white if color is not mapped
};

export const useBoreholeData = (csvUrl: string) => {
  const [boreholeData, setBoreholeData] = useState<BoreholeInterval[]>([]);

  useEffect(() => {
    d3.csv(csvUrl).then(data => {
      const filteredData = data.map(d => ({
        Borehole_Name: d['Borehole_Name'] as string,
        From_Depth_mbgs: +d['From_Depth_mbgs'],
        To_Depth_mbgs: +d['To_Depth_mbgs'],
        Pri_Material: d['Pri_Material'] as string,
        Sec_Material: d['Sec_Material'] as string || '',
        Colour: mapColor(d['Colour'] as string),
        Colour_Label: d['Colour'] as string,
        Full_Text: d['Full_Text'] as string || '',
        Comment: d['Comment'] as string || '',
      }));
      setBoreholeData(filteredData);
    }).catch(error => {
      console.error("Error loading CSV data:", error);
    });
  }, [csvUrl]);

  return boreholeData;
};