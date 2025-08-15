import express, { Express } from "express";
import usersRouter from "./users";
import ordersRouter from "./orders";
import messagesRouter from "./messages";
import { stripeWebhookHandler } from "../controllers/webhooks.stripe";
import deviceTokensRouter from "./devicetokens";

export function registerRoutes(app: Express) {
	// Stripe webhook must receive the raw body
	app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);

	// JSON-parsed routes below
	app.use("/api/users", usersRouter);
	app.use("/api/orders", ordersRouter);
	app.use("/api/messages", messagesRouter);
	app.use("/api/device-tokens", deviceTokensRouter);
}