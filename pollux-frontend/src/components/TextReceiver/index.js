import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
var socket;
const TextReceiver = (props) => {
  const [textShow, setText] = useState("");

  useEffect(() => {
    socket = socketIOClient(props.endpoint);

    socket.on("TextBroadCast", (message) => {
      console.log(message);
      if (message.sender != props.textID) setText(message.text);
    });
  });

  return <div>{textShow}</div>;
};

export default TextReceiver;
