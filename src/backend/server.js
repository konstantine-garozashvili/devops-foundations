const http = require("http");

const PORT = Number(process.env.BACKEND_PORT) || 3000;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function notImplemented(res, message) {
  sendJson(res, 501, {
    status: "not_implemented",
    message,
  });
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/health") {
    return sendJson(res, 200, { status: "ok", service: "backend" });
  }

  if (method === "GET" && url === "/") {
    return sendJson(res, 200, {
      message: "Welcome to the DevOps Foundations backend.",
      version: "0.1.0",
    });
  }

  if (method === "GET" && url === "/db") {
    return notImplemented(
      res,
      "Database connectivity check will be implemented in a later feature."
    );
  }

  if (method === "GET" && url === "/cache") {
    return notImplemented(
      res,
      "Redis visit counter will be implemented in a later feature."
    );
  }

  if (method === "POST" && url === "/contact") {
    return notImplemented(
      res,
      "Contact form handling and MailHog integration will be implemented later."
    );
  }

  sendJson(res, 404, { status: "not_found", path: url });
});

server.listen(PORT, () => {
  // Simple startup log for container logs and local runs.
  // eslint-disable-next-line no-console
  console.log(`Backend API listening on port ${PORT}`);
});

