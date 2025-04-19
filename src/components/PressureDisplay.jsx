import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';
import PressureGauge from './PressureGauge';

const PressureDisplay = ({ ros, onSensorStatusChange }) => {
  const [pressures, setPressures] = useState({
    pressure_1: 0,
    pressure_2: 0,
    pressure_3: 0,
    pressure_4: 0,
    pressure_5: 0
  });

  const latestPressuresRef = useRef(pressures); // Ref to hold latest pressures

  useEffect(() => {
    if (ros) {
      const topics = ['/pressure_1', '/pressure_2', '/pressure_3', '/pressure_4', '/pressure_5'];
      topics.forEach(topic => {
        const pressureTopic = new ROSLIB.Topic({
          ros: ros,
          name: topic,
          messageType: 'std_msgs/Float64'
        });

        pressureTopic.subscribe((message) => {
          console.log('Received message on ' + topic + ': ' + message.data);

          // Update the latest pressures using the ref
          latestPressuresRef.current = {
            ...latestPressuresRef.current,
            [topic.substring(1)]: message.data
          };

          // Determine connection status for each sensor
          const sensorStatus = Object.entries(latestPressuresRef.current).reduce((status, [sensor, value]) => {
            status[sensor] = value !== 0; // Sensor is connected if pressure is not zero
            return status;
          }, {});

          setPressures(latestPressuresRef.current); // Update state with the latest pressures
          onSensorStatusChange(sensorStatus);
        });

        return () => {
          pressureTopic.unsubscribe();
        };
      });
    }
  }, [ros, onSensorStatusChange]);

  return (
    <div className="container-fluid p-0">
      <div className="row mx-0">
        {Object.entries(pressures).map(([sensor, value]) => (
          <div key={sensor} className="col mb-3">
            <PressureGauge label={sensor} value={value} />
            <h4 className="text-white mt-2">Sensor: {sensor}</h4>
            <p className="text-white">Connection Status: {value !== 0 ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PressureDisplay;
