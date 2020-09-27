import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import VideoReproducer from "./components/VideoReproducer";
import TextEditor from "./components/TextEditor";
import TextReceiver from "./components/TextReceiver";
import VideoSender from "./components/VideoSender";
import uuid from "react-uuid";
const textSemderId = uuid();

const ENDPOINT = "http://127.0.0.1:3001";

function App() {
  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <VideoReproducer endpoint={ENDPOINT}></VideoReproducer>
          </Col>
          <Col>
            <VideoSender endpoint={ENDPOINT}></VideoSender>
          </Col>
        </Row>
        <Row>
          <Col>
            <TextEditor endpoint={ENDPOINT} textID={textSemderId}></TextEditor>
          </Col>
          <Col>
            <TextReceiver
              endpoint={ENDPOINT}
              textID={textSemderId}
            ></TextReceiver>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
