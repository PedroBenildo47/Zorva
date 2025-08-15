import { Router } from "express";
import { stripeWebhookHandler } from "../controllers/webhooks.stripe";

const router = Router();

router.post("/stripe", (req, res, next) => {
	// ensure raw body by re-parsing; in production use app.use for this route only
	(stripeWebhookHandler as any)(req, res, next);
});

export default router;