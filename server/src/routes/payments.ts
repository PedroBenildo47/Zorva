import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";

const router = Router();

router.get("/order/:orderId", async (req, res) => {
	const { orderId } = req.params;
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase.from("payments").select("*").eq("order_id", orderId).maybeSingle();
	if (error) return res.status(500).json({ error: error.message });
	return res.json({ payment: data });
});

const createSchema = z.object({ provider: z.enum(["cod","multicaixa","paypal","stripe"]) });
router.post("/order/:orderId", async (req, res) => {
	const parsed = createSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	const { orderId } = req.params;
	try {
		const supabase = getSupabaseAdmin();
		const { data: order, error } = await supabase.from("orders").select("id, amount, payment_status").eq("id", orderId).single();
		if (error || !order) return res.status(404).json({ error: "Order not found" });
		let provider_reference: string | null = null;
		let status: "initiated" | "requires_action" | "succeeded" = "initiated";
		if (parsed.data.provider === "cod") {
			status = "succeeded";
		}
		if (parsed.data.provider === "multicaixa") {
			// Placeholder: create reference and return it
			provider_reference = `REF-${Math.floor(Math.random()*1e8)}`;
			status = "requires_action";
		}
		if (parsed.data.provider === "paypal") {
			provider_reference = `PAYPAL-${Math.floor(Math.random()*1e8)}`;
			status = "requires_action";
		}
		if (parsed.data.provider === "stripe") {
			provider_reference = `STRIPE-USE-ORDERS-ENDPOINT`;
			status = "requires_action";
		}
		const { data: payment, error: perr } = await supabase.from("payments").upsert({ order_id: order.id, provider: parsed.data.provider, status, amount: order.amount, provider_reference }).select("*").single();
		if (perr) return res.status(500).json({ error: perr.message });
		return res.status(201).json({ payment });
	} catch (e: any) { return res.status(500).json({ error: e.message }); }
});

const confirmSchema = z.object({ status: z.enum(["succeeded","failed"]) });
router.post("/order/:orderId/confirm", async (req, res) => {
	const parsed = confirmSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	const { orderId } = req.params;
	const supabase = getSupabaseAdmin();
	await supabase.from("payments").update({ status: parsed.data.status }).eq("order_id", orderId);
	if (parsed.data.status === "succeeded") await supabase.from("orders").update({ payment_status: "paid" }).eq("id", orderId);
	return res.json({ ok: true });
});

export default router;