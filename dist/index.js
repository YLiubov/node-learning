import http from "http";
// =========================
// CREATE SERVER
// =========================
const server = http.createServer((request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/plain",
    });
    response.end("Hello, world! The server is working.");
});
// =========================
// START SERVER
// =========================
server.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
