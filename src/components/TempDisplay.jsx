import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';
import TempGauge from './TempGauge';

const TemperatureDisplay = ({ ros, onSensorStatusChange }) => {
  const [temperatures, setTemperatures] = useState({
    temperature_1: 0,
    temperature_2: 0,
    temperature_3: 0,
    temperature_4: 0,
    temperature_5: 0
  });
  const [textColor, setTextColor] = useState('white');
  const latestTemperaturesRef = useRef(temperatures);
  const timersRef = useRef({});

  useEffect(() => {
    if (ros) {
      const topics = ['/temperature_1', '/temperature_2', '/temperature_3', '/temperature_4', '/temperature_5'];
      const timeoutDuration = 3000; // 5 seconds timeout for sensor status

      topics.forEach(topic => {
        const temperatureTopic = new ROSLIB.Topic({
          ros: ros,
          name: topic,
          messageType: 'std_msgs/Float64'
        });

        temperatureTopic.subscribe((message) => {
          console.log('Received message on ' + topic + ': ' + message.data);
          latestTemperaturesRef.current = {
            ...latestTemperaturesRef.current,
            [topic.substring(1)]: message.data
          };
          setTemperatures({ ...latestTemperaturesRef.current });

          // Reset the timer for this sensor
          if (timersRef.current[topic]) {
            clearTimeout(timersRef.current[topic]);
          }
          timersRef.current[topic] = setTimeout(() => {
            latestTemperaturesRef.current = {
              ...latestTemperaturesRef.current,
              [topic.substring(1)]: 0
            };
            setTemperatures({ ...latestTemperaturesRef.current });
            updateSensorStatus();
          }, timeoutDuration);

          updateSensorStatus();

          // Update text color based on temperature thresholds
          if (message.data > 80) {
            setTextColor('red');
          } else if (message.data < 20) {
            setTextColor('blue');
          } else {
            setTextColor('white');
          }
        });

        return () => {
          temperatureTopic.unsubscribe();
          if (timersRef.current[topic]) {
            clearTimeout(timersRef.current[topic]);
          }
        };
      });
    }
  }, [ros, onSensorStatusChange]);

  const updateSensorStatus = () => {
    const sensorStatus = Object.entries(latestTemperaturesRef.current).reduce((status, [sensor, temp]) => {
      status[sensor] = temp !== 0;
      return status;
    }, {});
    onSensorStatusChange(sensorStatus);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row mx-0">
        {Object.entries(temperatures).map(([sensor, temp]) => (
          <div key={sensor} className="col mb-3">
            <TempGauge label={sensor} value={temp} textColor={textColor} />
            <h4 className={`mt-2 ${temp > 80 ? 'text-danger' : (temp < 20 ? 'text-primary' : 'text-white')}`}>Sensor: {sensor}</h4>
            <p>Connection Status: {temp !== 0 ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureDisplay;
