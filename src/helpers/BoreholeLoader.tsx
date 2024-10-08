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

interface BoreholeData {
  Name: string;
  Source_ID: string;
  Alias1?: string;
  Date_Drilled?: string;
  Depth_Reference?: string;
  El_DR_masl?: number;
  Elev_Method?: string;
  Total_Depth_m?: number;
  E_10TM83?: number;
  N_10TM83?: number;
  Lat_NAD83?: number;
  Long_NAD83?: number;
  Source_CRS?: string;
  Drilling_Company?: string;
  Drilling_Method?: string;
  Driller?: string;
  Logger?: string;
  Owner?: string;
  Well_Presence?: string;
  Spatial_Precision?: number;
  Georef?: string;
  Folder?: string;
  LogPDF?: string;
  Purpose?: string;
  Comment?: string;
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

export const useBoreholeData = (segmentsCsvUrl: string, boreholesCsvUrl: string) => {
  const [segmentData, setSegmentData] = useState<BoreholeInterval[]>([]);
  const [boreholeData, setBoreholeData] = useState<BoreholeData[]>([]);

  useEffect(() => {
    const loadSegmentData = async (csvUrl: string) => {
      const data = await d3.csv(csvUrl);
      return data.map(d => ({
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
    };

    const loadBoreholeData = async (csvUrl: string) => {
      const data = await d3.csv(csvUrl);
      return data.map(d => ({
        Name: d['Name'] as string,
        Source_ID: d['Source_ID'] as string,
        Alias1: d['Alias1'] || '',
        Date_Drilled: d['Date_Drilled'] || '',
        Depth_Reference: d['Depth_Reference'] || '',
        El_DR_masl: d['El_DR_masl'] ? +d['El_DR_masl'] : undefined,
        Elev_Method: d['Elev_Method'] || '',
        Total_Depth_m: d['Total_Depth_m'] ? +d['Total_Depth_m'] : undefined,
        E_10TM83: d['E_10TM83'] ? +d['E_10TM83'] : undefined,
        N_10TM83: d['N_10TM83'] ? +d['N_10TM83'] : undefined,
        Lat_NAD83: d['Lat_NAD83'] ? +d['Lat_NAD83'] : undefined,
        Long_NAD83: d['Long_NAD83'] ? +d['Long_NAD83'] : undefined,
        Source_CRS: d['Source_CRS'] || '',
        Drilling_Company: d['Drilling_Company'] || '',
        Drilling_Method: d['Drilling_Method'] || '',
        Driller: d['Driller'] || '',
        Logger: d['Logger'] || '',
        Owner: d['Owner'] || '',
        Well_Presence: d['Well_Presence'] || '',
        Spatial_Precision: d['Spatial_Precision'] ? +d['Spatial_Precision'] : undefined,
        Georef: d['Georef'] || '',
        Folder: d['Folder'] || '',
        LogPDF: d['LogPDF'] || '',
        Purpose: d['Purpose'] || '',
        Comment: d['Comment'] || '',
      }));
    };

    const loadData = async () => {
      try {
        const segments = await loadSegmentData(segmentsCsvUrl);
        setSegmentData(segments);

        const boreholes = await loadBoreholeData(boreholesCsvUrl);
        setBoreholeData(boreholes);
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    };

    loadData();
  }, [segmentsCsvUrl, boreholesCsvUrl]);

  return { segmentData, boreholeData };
};