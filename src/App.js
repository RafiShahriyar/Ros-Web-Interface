import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';
import axios from 'axios';
import TempDisplay from './components/TempDisplay';
import PressureDisplay from './components/PressureDisplay';
import MotorControl from './components/MotorControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ResponsiveAutoExample from './components/grid';
import VideoStream from './components/VideoStream';

function App() {
  const [ros, setRos] = useState(null);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false); // State to track ROS connection status
  const [gasSensorData, setGasSensorData] = useState(0);
  const [gasSensorConnected, setGasSensorConnected] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [alarmSensorConnected, setAlarmSensorConnected] = useState(false);
  const [sensorStatus, setSensorStatus] = useState({
    temperature_1: false,
    temperature_2: false,
    temperature_3: false,
    temperature_4: false,
    temperature_5: false,
    pressure_1: false,
    pressure_2: false,
    pressure_3: false,
    pressure_4: false,
    pressure_5: false
  }); // State to track sensor connection statuses

  useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'black';
    const ros = new ROSLIB.Ros({
      url: 'ws://192.168.31.39:9090'
    });

    setRos(ros);

    ros.on('connection', () => {
      console.log('Connected to ROS');
      setMessage('Connected to ROS');
      setConnected(true); // Update connection status
    });

    ros.on('error', (error) => {
      console.error('Error connecting to ROS:', error);
      setMessage('Error connecting to ROS');
      setConnected(false); // Update connection status
    });

    ros.on('close', () => {
      console.log('Disconnected from ROS');
      setMessage('Disconnected from ROS');
      setConnected(false); // Update connection status
    });

    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
      if (ros) {
        ros.close();
      }
    };
  }, []);

  useEffect(() => {
    if (ros) {
      const gasSensorTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/gas',
        messageType: 'std_msgs/Float64'
      });

      gasSensorTopic.subscribe((message) => {
        console.log('Received message on /gas_sensor: ' + message.data);
        setGasSensorData(message.data);
        setGasSensorConnected(true);
      });

      return () => {
        gasSensorTopic.unsubscribe();
      };
    }
  }, [ros]);

  useEffect(() => {
    if (ros) {
      const alarmStatusTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/alarm_status',
        messageType: 'std_msgs/String'
      });

      alarmStatusTopic.subscribe((message) => {
        console.log('Received message on /alarm_status: ' + message.data);
        setAlarm(message.data === 'ACTIVE'); // Update condition here
        setAlarmSensorConnected(true);
      });

      return () => {
        alarmStatusTopic.unsubscribe();
      };
    }
  }, [ros]);



  const fetchInfluxData = async () => {
    try {
      const response = await axios.get('http://192.168.31.39:8086/query', {
        params: {
          db: 'sensor_data',
          q: 'SELECT * FROM sensor2'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data from InfluxDB:', error);
    }
  };

  fetchInfluxData();

  const handleSensorStatusChange = (updatedSensorStatus) => {
    setSensorStatus((prevStatus) => ({
      ...prevStatus,
      ...updatedSensorStatus
    }));
  };

  const videoStreamUrl = 'http://192.168.31.39:8080/stream?topic=/usb_cam/image_raw'; 

  const cardStyle = {

    color: 'white',
    padding: '20px',
    margin: '10px 0',
    borderRadius: '5px',
    textAlign: 'center',
    minHeight: '150px',
    border: '1px solid #555' // Adding border
  };

  return (
    <div className="bg-black text-white">
      <div className="container text-center">
        <h1>ROS Web Interface</h1>
        {connected ? (
          <p>
            Message from ROS: Connected <span style={{ color: 'green' }}>●</span>
          </p>
        ) : (
          <p>
            Message from ROS: Disconnected <span style={{ color: 'red' }}>●</span>
          </p>
        )}
      </div>
      <Container>
        <Row className="mb-3">
          <Col sm={6} >
          <Card style={cardStyle} className='bg-dark'>
            <div>
            <Card.Header className='bg-black'>
              <h3>ROS Connection Status</h3>
              </Card.Header>
              {connected ? (
                <p>
                  Connected <span style={{ color: 'green' }}>●</span>
                </p>
              ) : (
                <p>
                  Disconnected <span style={{ color: 'red' }}>●</span>
                </p>
              )}
            </div>
          </Card>
            <Row>
              <Col sm={12} >
                <MotorControl ros={ros} />
              </Col>
              <Col sm={12}  >
                {/* Empty Box */}
                <Card  bg="dark border border-secondary rounded" text="white" style={cardStyle}>
                  <Card.Header className='bg-black'>Live Video Feed</Card.Header>
                  <Card.Body>
                    <VideoStream url={videoStreamUrl} />
                  </Card.Body>


                </Card>

              </Col>

              <Col sm={12} >
              </Col>
              <Col sm={12} >
                {/* Empty Box */}
                <Card bg="dark border border-secondary rounded" text="white" style={cardStyle}>
                  <Card.Header className="bg-black">Gas Sensor Status: {gasSensorConnected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</Card.Header>
                  <Card.Body>
                    <h5>Gas Sensor Data: {gasSensorData}</h5>
                  </Card.Body>
                </Card>


              </Col>
              <Col sm={12} >
                {/* Empty Box */}
                <Card bg="dark border border-secondary rounded" text="white" style={cardStyle}>
                  <Card.Header className="bg-black">Alarm Sensor Status: {alarmSensorConnected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</Card.Header>
                  <Card.Body>
                    <h5>Alarm: {alarm ? <span style={{ color: 'red' }}>ACTIVE</span> : <span style={{ color: 'green' }}>INACTIVE</span>}</h5>
                  </Card.Body>
                </Card>


              </Col>
            </Row>
          </Col>
          <Col sm={6} >
            <Row>
              <Col sm={12} >
                <Card bg="dark border border-secondary rounded" text="white" style={cardStyle}>
                  <Card.Header className="bg-black">Temperature Sensors Connection Status</Card.Header>
                  <Card.Body>
                    {Object.entries(sensorStatus).map(([sensor, connected]) => (
                      sensor.startsWith('temperature') && (
                        <div key={sensor} className="mb-3">
                          <h5>Sensor: {sensor}</h5>
                          <p>Connection Status: {connected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</p>
                        </div>
                      )
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} >
                <div>
                  <Card bg="dark border border-secondary rounded"  text="white" style={cardStyle}>
                  <Card.Header className="bg-black">Pressure Sensors Connection Status</Card.Header>
                  <Card.Body>
                    {Object.entries(sensorStatus).map(([sensor, connected]) => (
                      sensor.startsWith('pressure') && (
                        <div key={sensor} className="mb-3">
                          <h5>Sensor: {sensor}</h5>
                          <p>Connection Status: {connected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</p>
                        </div>
                    )
                    ))}
                  </Card.Body>
                </Card>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="container text-center mt-5">
        <h3>Sensor Data Displays</h3>
        <div className="mt-5 mb-5 border border-secondary rounded">
          <h2 className="text-center">Temperature Display</h2>
          <TempDisplay ros={ros} onSensorStatusChange={handleSensorStatusChange} />
        </div>
        <div className="mt-5 mb-5 border border-secondary rounded">
          <h2 className="text-center">Pressure Display</h2>
          <PressureDisplay ros={ros} onSensorStatusChange={handleSensorStatusChange} />
        </div>

      </div>

    </div>
  );
}

export default App;
