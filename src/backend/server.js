const http = require("http");
const { Pool } = require("pg");
const { createClient } = require("redis");
const nodemailer = require("nodemailer");

const rawPort = process.env.BACKEND_PORT;
if (!rawPort) {
  throw new Error("BACKEND_PORT environment variable must be set");
}

const PORT = Number(rawPort);

if (Number.isNaN(PORT)) {
  throw new Error(`BACKEND_PORT must be a valid number, got "${rawPort}"`);
}

const rawPostgresPort = process.env.POSTGRES_PORT;
if (!rawPostgresPort) {
  throw new Error("POSTGRES_PORT environment variable must be set");
}
const POSTGRES_PORT = Number(rawPostgresPort);
if (Number.isNaN(POSTGRES_PORT)) {
  throw new Error(`POSTGRES_PORT must be a number, got "${rawPostgresPort}"`);
}

const rawRedisPort = process.env.REDIS_PORT;
if (!rawRedisPort) {
  throw new Error("REDIS_PORT environment variable must be set");
}
const REDIS_PORT = Number(rawRedisPort);
if (Number.isNaN(REDIS_PORT)) {
  throw new Error(`REDIS_PORT must be a number, got "${rawRedisPort}"`);
}

const rawMailhogPort = process.env.MAILHOG_SMTP_PORT;
if (!rawMailhogPort) {
  throw new Error("MAILHOG_SMTP_PORT environment variable must be set");
}
const MAILHOG_SMTP_PORT = Number(rawMailhogPort);
if (Number.isNaN(MAILHOG_SMTP_PORT)) {
  throw new Error(
    `MAILHOG_SMTP_PORT must be a number, got "${rawMailhogPort}"`
  );
}

const pgPool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Redis client error:", err.message);
});

redisClient.connect().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Redis initial connection failed:", err.message);
});

const mailTransporter = nodemailer.createTransport({
  host: process.env.MAILHOG_HOST,
  port: MAILHOG_SMTP_PORT,
  secure: false,
});

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function handleHealth(res) {
  const result = { status: "ok", service: "backend" };

  try {
    const db = await pgPool.query("SELECT current_database() AS name, NOW() AS now");
    result.database = {
      status: "ok",
      name: db.rows[0].name,
      timestamp: db.rows[0].now,
    };
  } catch (err) {
    result.database = { status: "error", message: err.message };
  }

  try {
    const pong = await redisClient.ping();
    result.cache = { status: "ok", ping: pong };
  } catch (err) {
    result.cache = { status: "error", message: err.message };
  }

  sendJson(res, 200, result);
}

async function handleDb(res) {
  try {
    const db = await pgPool.query("SELECT current_database() AS name, NOW() AS now");
    sendJson(res, 200, {
      status: "ok",
      database: db.rows[0].name,
      timestamp: db.rows[0].now,
    });
  } catch (err) {
    sendJson(res, 500, {
      status: "error",
      message: "Database connectivity check failed",
      error: err.message,
    });
  }
}

async function handleCache(res) {
  const key = "visit_counter";
  try {
    const count = await redisClient.incr(key);
    sendJson(res, 200, {
      status: "ok",
      counter: count,
    });
  } catch (err) {
    sendJson(res, 500, {
      status: "error",
      message: "Redis counter operation failed",
      error: err.message,
    });
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!data) {
        return resolve({});
      }
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

async function handleContact(req, res) {
  let body;
  try {
    body = await parseJsonBody(req);
  } catch (err) {
    return sendJson(res, 400, {
      status: "error",
      message: "Invalid JSON body",
      error: err.message,
    });
  }

  const { name, email, message } = body || {};

  if (!name || !email || !message) {
    return sendJson(res, 400, {
      status: "error",
      message: "Missing required fields: name, email, message",
    });
  }

  const to = process.env.CONTACT_FORM_DEFAULT_TO || "devops@example.local";

  try {
    await mailTransporter.sendMail({
      from: `"${name}" <${email}>`,
      to,
      subject: "DevOps Foundations contact message",
      text: message,
    });

    sendJson(res, 200, {
      status: "ok",
      message: "Contact request accepted and email queued for delivery.",
    });
  } catch (err) {
    sendJson(res, 500, {
      status: "error",
      message: "Failed to send contact email",
      error: err.message,
    });
  }
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/health") {
    return handleHealth(res);
  }

  if (method === "GET" && url === "/") {
    return sendJson(res, 200, {
      message: "Welcome to the DevOps Foundations backend.",
      version: "0.2.0",
    });
  }

  if (method === "GET" && url === "/db") {
    return handleDb(res);
  }

  if (method === "GET" && url === "/cache") {
    return handleCache(res);
  }

  if (method === "POST" && url === "/contact") {
    return handleContact(req, res);
  }

  sendJson(res, 404, { status: "not_found", path: url });
});

server.listen(PORT, () => {
  // Simple startup log for container logs and local runs.
  // eslint-disable-next-line no-console
  console.log(`Backend API listening on port ${PORT}`);
});

