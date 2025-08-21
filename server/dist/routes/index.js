import express from "express";
import usersRouter from "./users";
import ordersRouter from "./orders";
import messagesRouter from "./messages";
import { stripeWebhookHandler } from "../controllers/webhooks.stripe";
import deviceTokensRouter from "./devicetokens";
import storesRouter from "./stores";
import productsRouter from "./products";
import driversRouter from "./drivers";
import authRouter from "./auth";
import cartsRouter from "./carts";
import paymentsRouter from "./payments";
import ratingsRouter from "./ratings";
export function registerRoutes(app) {
    // Stripe webhook must receive the raw body
    app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);
    // JSON-parsed routes below
    app.use("/api/auth", authRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/orders", ordersRouter);
    app.use("/api/messages", messagesRouter);
    app.use("/api/device-tokens", deviceTokensRouter);
    app.use("/api/stores", storesRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/drivers", driversRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/payments", paymentsRouter);
    app.use("/api/ratings", ratingsRouter);
}
