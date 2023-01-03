const apps = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = (val) => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// const onError = (error) => {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   const bind = typeof port === "string" ? "pipe " + port : "port " + port;
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " wymaga zwiększonych uprawnień");
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(bind + " aktualnie w użyciu");
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// };

// const onListening = () => {
//   const addr = server.address();
//   const bind = typeof port === "string" ? "pipe " + port : "port " + port;
//   debug("Listening on " + bind);
// };

// const port = normalizePort("4201");
// app.set("port", port);

const server = http.createServer(apps);
// server.on("error", onError);
// server.on("listening", onListening);
server.listen(3000, '127.0.0.1', function() {
    console.log("Server now listening on 4201");
});
