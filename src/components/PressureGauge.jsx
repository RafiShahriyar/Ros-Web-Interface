
import React from 'react';
import GaugeComponent from 'react-gauge-component';

const PressureGauge = ({ label, value }) => {
  return (
    <div style={{ width: '350px', margin: 'auto' }}>
        <GaugeComponent
            arc={{
                subArcs: [
                {
                    limit: 20,
                    color: '#5BE12C',
                    // color: '#EA4228',
                    showTick: true
                },
                {
                    limit: 40,
                    color: '#F5CD19',
                    // color: '#F58B19',
                    showTick: true
                },
                {
                    limit: 60,
                    color: '#F58B19',
                    // color: '#F5CD19',
                    showTick: true
                },
                {
                    limit: 100,
                    color: '#EA4228',
                    // color: '#5BE12C',
                    showTick: true
                },
                ]
            }}
            value={value}
        />
        <div>PressureGauge</div>
    </div>
  )
}

export default PressureGauge