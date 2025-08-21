import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";

import { registerRoutes } from "./routes";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });
(app as any).set("io", io);

// Health first
app.get("/health", (_req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Security and CORS
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

// JSON body for all non-raw routes is applied inside registerRoutes
// where Stripe webhook uses express.raw()
app.use(express.json({ limit: "1mb" }));

registerRoutes(app);

io.on("connection", (socket) => {
	socket.on("join-order", (orderId: string) => socket.join(`order:${orderId}`));
	socket.on("driver-location", ({ orderId, location }) => {
		io.to(`order:${orderId}`).emit("driver-location", location);
	});
});

const port = Number(process.env.PORT || 4000);
server.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Zorva API listening on http://localhost:${port}`);
});