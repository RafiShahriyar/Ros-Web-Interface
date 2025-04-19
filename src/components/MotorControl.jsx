import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const MotorControl = ({ ros }) => {
  const [motorStatus, setMotorStatus] = useState('OFF');

  useEffect(() => {
    if (ros) {
      const motorStatusTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/motor_status',
        messageType: 'std_msgs/String'
      });

      motorStatusTopic.subscribe((message) => {
        setMotorStatus(message.data);
      });

      return () => motorStatusTopic.unsubscribe();
    }
  }, [ros]);

  const sendMotorCommand = (command) => {
    if (ros) {
      const motorControlTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/motor_control',
        messageType: 'std_msgs/String'
      });

      const commandMessage = new ROSLIB.Message({
        data: command
      });

      motorControlTopic.publish(commandMessage);
      console.log(`Sent motor command: ${command}`);
    }
  };

  return (
    <div className="card mt-5 mb-5 bg-dark border-secondary">
      <div className="card-header text-center text-white bg-black">
        <h3>Motor Control</h3>
      </div>
      <div className="card-body text-center">
        <h4 className="card-title text-white">
          Motor Status: {motorStatus === 'ON' ? <span style={{ color: 'green' }}>ON</span> : <span style={{ color: 'red' }}>OFF</span>}
        </h4>
        <ButtonGroup className="mt-4">
          <Button variant="primary" onClick={() => sendMotorCommand('START')}>Start</Button>
          <Button variant="danger" onClick={() => sendMotorCommand('STOP')}>Stop</Button>

        </ButtonGroup>
      </div>
    </div>
  );
};

export default MotorControl;
