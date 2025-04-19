import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ResponsiveAutoExample() {
  const boxStyle = {
    backgroundColor: '#343a40', // Dark background
    color: 'white', // White text
    padding: '20px',
    margin: '10px 0',
    borderRadius: '5px',
    textAlign: 'center'
  };

  return (
    <Container>
      <Row>
        <Col sm={12} style={boxStyle}>sm=8</Col>
        <Col sm={6} style={boxStyle}>sm=4</Col>
        <Col sm={3} style={boxStyle}>sm=4</Col>
        <Col sm={3} style={boxStyle}>sm=auto</Col>
      </Row>
      <Row>
        <Col sm={6} style={boxStyle}>sm=true</Col>
      </Row>
    </Container>
  );
}

export default ResponsiveAutoExample;
