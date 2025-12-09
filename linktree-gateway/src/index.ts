import "dotenv/config";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticateToken } from "./middlewares/authenticate-token.ts";

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const MANAGEMENT_SERVICE_URL =
  process.env.MANAGEMENT_SERVICE_URL || "http://localhost:3002";
const PUBLIC_SERVICE_URL =
  process.env.PUBLIC_SERVICE_URL || "http://localhost:3003";

app.use(cors());

app.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/linktrees",
  authenticateToken,
  (req, res, next) => {
    const userId = req.user?.id;
    req.headers["x-user-id"] = userId?.toString() || "";
    next();
  },
  createProxyMiddleware({
    target: MANAGEMENT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/public",
  createProxyMiddleware({
    target: PUBLIC_SERVICE_URL,
    changeOrigin: true,
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok from gateway" });
});

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});
