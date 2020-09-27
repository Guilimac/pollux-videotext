import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
const config = {
  // eslint-disable-line no-unused-vars
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};
let peerConnection;
var socket;
const VideoReproducer = (props) => {
  const videoRef = React.useRef(null);
  useEffect(() => {
    socket = socketIOClient(props.endpoint);
    socket.on("offer", function (id, description) {
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit("answer", id, peerConnection.localDescription);
        });
      peerConnection.ontrack = function (event) {
        const video = ReactDOM.findDOMNode(videoRef.current);

        video.srcObject = event.streams[0];
      };
      peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });
    socket.on("candidate", function (id, candidate) {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });

    socket.on("connect", function () {
      socket.emit("watcher");
    });

    socket.on("broadcaster", function () {
      socket.emit("watcher");
    });

    socket.on("bye", function () {
      peerConnection.close();
    });
  });
  return <video ref={videoRef} playsInline autoPlay muted></video>;
};
export default VideoReproducer;
