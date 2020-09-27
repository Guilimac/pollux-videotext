import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ReactDOM from "react-dom";
const config = {
  // eslint-disable-line no-unused-vars
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};
/** @type {MediaStreamConstraints} */
const constraints = {
  // audio: true,
  video: { facingMode: "user" },
};
const peerConnections = {};
var socket;

const VideoSender = (props) => {
  const videoRef = React.useRef(null);
  useEffect(() => {
    const video = ReactDOM.findDOMNode(videoRef.current);
    socket = socketIOClient(props.endpoint);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        video.srcObject = stream;
        socket.emit("broadcaster");
      })
      .catch((error) => console.error(error));

    socket.on("answer", function (id, description) {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on("watcher", function (id) {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;
      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit("offer", id, peerConnection.localDescription);
        });
      peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });

    socket.on("candidate", function (id, candidate) {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("bye", function (id) {
      peerConnections[id] && peerConnections[id].close();
      delete peerConnections[id];
    });
  });
  return <video ref={videoRef} playsInline autoPlay muted></video>;
};
export default VideoSender;
