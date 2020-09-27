const credentials = require("./credentials");
const express = require("express");
const app = express();
let broadcasters = [];
let server;
let port;
if (credentials.key && credentials.cert) {
  const https = require("https");
  server = https.createServer(credentials, app);
  port = 443;
} else {
  const http = require("http");
  server = http.createServer(app);
  port = 3001;
}
const io = require("socket.io")(server);
io.sockets.on("error", (e) => console.log(e));
io.sockets.on("connection", function (socket) {
  socket.on("broadcaster", function () {
    let connectedBroadcasters = broadcasters.find(
      (connectedBroadcasters) => connectedBroadcasters === socket.id
    );
    if (!connectedBroadcasters) {
      broadcasters.push(socket.id);
    }
    socket.broadcast.emit("broadcaster");
  });
  socket.on("TextEmit", function (message) {
    socket.broadcast.emit("TextBroadCast", message);
  });
  socket.on("watcher", function () {
    let broadcaster = broadcasters.find(
      (broadcaster) => broadcaster !== socket.id
    );
    broadcaster && socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", function (id /* of the watcher */, message) {
    socket.to(id).emit("offer", socket.id /* of the broadcaster */, message);
  });
  socket.on("answer", function (id /* of the broadcaster */, message) {
    socket.to(id).emit("answer", socket.id /* of the watcher */, message);
  });
  socket.on("candidate", function (id, message) {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", function () {
    let broadcaster = broadcasters.find(
      (broadcaster) => broadcaster !== socket.id
    );
    broadcaster && socket.to(broadcaster).emit("bye", socket.id);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
