import Stripe from "stripe";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });

export function stripeWebhookHandler(req: Request, res: Response) {
	const sig = req.headers["stripe-signature"] as string;
	if (!sig) return res.status(400).send("Missing signature");
	try {
		const payload = Buffer.isBuffer(req.body) ? (req.body as Buffer) : Buffer.from((req as any).rawBody ?? JSON.stringify(req.body));
		const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
		return res.json({ received: true, type: event.type });
	} catch (err: any) {
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}
}