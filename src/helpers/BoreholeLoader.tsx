import { useState, useEffect } from 'react';
import * as d3 from 'd3';

// Type definition for the borehole interval
interface BoreholeInterval {
  Borehole_Name: string;
  From_Depth: number;
  To_Depth: number;
  Pri_Material: string;
  Colour: string;
}

export const useBoreholeData = (csvUrl: string) => {
  const [boreholeData, setBoreholeData] = useState<BoreholeInterval[]>([]);

  useEffect(() => {
    // Load the CSV data
    d3.csv(csvUrl, d => ({
      Borehole_Name: d['Borehole_Name'] as string,
      From_Depth: +d['From_Depth'],
      To_Depth: +d['To_Depth'],
      Pri_Material: d['Pri_Material'] as string,
      Colour: d['Colour'] as string,
    })).then(data => {
      // Filter for Borehole_Name '1' and set the filtered data
      const filteredData = data.filter(interval => interval.Borehole_Name === '1');
      setBoreholeData(filteredData);
    }).catch(error => {
      console.error("Error loading CSV data:", error);
    });
  }, [csvUrl]);

  return boreholeData;
};
