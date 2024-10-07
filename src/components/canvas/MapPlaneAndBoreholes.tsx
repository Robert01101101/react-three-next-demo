import { useState } from 'react';
import { MapSurface } from './MapSurface';
import { Boreholes } from './Boreholes';
import { TransparencySlider } from './TransparencySlider';
import { useBoreholeData } from 'src/helpers/BoreholeLoader';

const boreholeCsvUrl = '/DIG_2014_0012/Intervals.csv';

interface MapPlaneAndBoreholesProps {
  opacity: number;
}

export function MapPlaneAndBoreholes({ opacity }: MapPlaneAndBoreholesProps) {

  // Load borehole data
  const boreholeData = useBoreholeData(boreholeCsvUrl);
  const boreholeSegments = boreholeData.map((d) => ({
    from: d.From_Depth_mbgs,
    to: d.To_Depth_mbgs,
    color: d.Colour,
    color_label: d.Colour_Label,
    pri_material: d.Pri_Material,
    sec_material: d.Sec_Material,
    full_text: d.Full_Text,
    comment: d.Comment,
  }));

  return (
    <>
      <MapSurface opacity={opacity} />
      <Boreholes boreholeSegments={boreholeSegments} />
    </>
  );
}