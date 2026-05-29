import http, { IncomingMessage, ServerResponse } from "http";

// =========================
// CREATE SERVER
// =========================

const server = http.createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, {
      "Content-Type": "text/plain",
    });

    response.end("Hello, world!");

    console.log('Server responded with "Hello, world!"');
  }
);

// =========================
// START SERVER
// =========================

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});