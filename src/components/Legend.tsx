// Legend.js
import React from 'react';
import '../../styles/legend.css';

const legendItems = [
  { color: '#aaaaaa', label: 'Grey: Material A' },
  { color: '#888888', label: 'Dark Grey: Material B' },
  { color: '#555555', label: 'Dark Grey: Material C' },
  { color: '#aaaacc', label: 'Bluish Grey: Material D' },
  // Add more legend items as needed
];

const Legend = () => {
  return (
    <div className="legend">
      <h3>Borehole Lithology</h3>
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: item.color }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};


export default Legend;
