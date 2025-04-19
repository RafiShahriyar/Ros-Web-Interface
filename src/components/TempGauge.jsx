// src/components/GaugeComponent.js

import React from 'react';
import GaugeComponent from 'react-gauge-component';

const TempGauge = ({ label, value,textColor }) => {
  return (
    <div style={{ width: '350px', margin: 'auto' }}>
      {/* <h3 style={{color:'white'}}>{label}</h3> */}
      <GaugeComponent
        type="semicircle"
        value={value}
        minValue={0}
        maxValue={100}
        arc={{
          width: 0.2,
          padding: 0.005,
          cornerRadius: 1,
          subArcs: [
            {
              limit: 0,
              color: '#EA4228',
              showTick: true,
              tooltip: {
                text: 'Too low temperature!',
              },
              onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
              onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
              onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
            },
            {
              limit: 21,
              color: '#F5CD19',
              showTick: true,
              tooltip: {
                text: 'Low temperature!',
              },
            },
            {
              limit: 50,
              color: '#5BE12C',
              showTick: true,
              tooltip: {
                text: 'OK temperature!',
              },
            },
            {
              limit: 79,
              color: '#F5CD19',
              showTick: true,
              tooltip: {
                text: 'High temperature!',
              },
            },
            {
              color: '#EA4228',
              tooltip: {
                text: 'Too high temperature!',
              },
            },
          ],
        }}
        pointer={{
          color: '#345243',
          length: 0.80,
          width: 15,
        }}
        labels={{
          valueLabel: { formatTextValue: value => value + 'ºC', style: { fill: textColor }},
          tickLabels: {
            type: 'outer',
            valueConfig: { formatTextValue: value => value + 'ºC', fontSize: 10},
            ticks: [
  
              { value: 100 },
            ],
          },
        }}
      />

    </div>

  );
};

export default TempGauge;
