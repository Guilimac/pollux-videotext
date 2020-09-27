import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import socketIOClient from "socket.io-client";

var socket;
const TextEditor = (props) => {
  const [textInput, setText] = useState("");

  useEffect(() => {
    socket = socketIOClient(props.endpoint);
    socket.emit("TextEmit", { sender: props.textID, text: textInput });
  });

  const handleChange = (event) => {
    setText(event.target.value);
  };
  return (
    <Form>
      <Form.Control
        type="text"
        placeholder="Input Text"
        value={textInput}
        onChange={handleChange}
      />
    </Form>
  );
};

export default TextEditor;
