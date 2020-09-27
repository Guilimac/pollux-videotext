import React from "react";
import logo from "./logo.svg";
import uuid from "react-uuid";
const textSemderId = uuid();
import { Container, Row, Col } from "react-bootstrap";

const ENDPOINT = "http://127.0.0.1:3001"; //CHANGE FOR NEW SERVER
function App() {
  return (
    <div className="App">
      <Container>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
