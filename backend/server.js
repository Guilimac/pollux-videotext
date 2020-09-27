const credentials = require("./credentials");
const express = require("express");
const app = express();
let server;
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
  console.log(socket.id);
});

server.listen(port, () => {
  console.log("server on!");
});
