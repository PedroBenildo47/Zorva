import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
import { calculatePriceFromPoints } from "@zorva/shared";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
	try {
		const supabase = getSupabaseAdmin();
		const { data: cart } = await supabase.from("carts").select("*").eq("user_id", (req as any).user.id).maybeSingle();
		if (!cart) return res.json({ cart: null, items: [] });
		const { data: items } = await supabase.from("cart_items").select("*").eq("cart_id", cart.id);
		return res.json({ cart, items });
	} catch (e: any) { return res.status(500).json({ error: e.message }); }
});

const addItemSchema = z.object({ product_id: z.string().uuid(), quantity: z.number().int().positive(), price_cents: z.number().int().positive(), store_id: z.string().uuid().optional() });
router.post("/items", requireAuth, async (req, res) => {
	const parsed = addItemSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		let { data: cart } = await supabase.from("carts").select("*").eq("user_id", (req as any).user.id).maybeSingle();
		if (!cart) {
			const insert = await supabase.from("carts").insert({ user_id: (req as any).user.id, store_id: parsed.data.store_id }).select("*").single();
			cart = insert.data!;
		}
		const { data: item, error } = await supabase.from("cart_items").insert({ cart_id: cart.id, product_id: parsed.data.product_id, quantity: parsed.data.quantity, price_cents: parsed.data.price_cents }).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		return res.status(201).json({ item });
	} catch (e: any) { return res.status(500).json({ error: e.message }); }
});

const updateItemSchema = z.object({ quantity: z.number().int().positive() });
router.patch("/items/:id", requireAuth, async (req, res) => {
	const parsed = updateItemSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("cart_items").update({ quantity: parsed.data.quantity }).eq("id", req.params.id).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		return res.json({ item: data });
	} catch (e: any) { return res.status(500).json({ error: e.message }); }
});

router.delete("/items/:id", requireAuth, async (req, res) => {
	try {
		const supabase = getSupabaseAdmin();
		await supabase.from("cart_items").delete().eq("id", req.params.id);
		return res.status(204).send();
	} catch (e: any) { return res.status(500).json({ error: e.message }); }
});

const checkoutSchema = z.object({
	origin: z.object({ lat: z.number(), lng: z.number(), address: z.string().optional() }),
	destination: z.object({ lat: z.number(), lng: z.number(), address: z.string().optional() }),
	payment_method: z.enum(["cash","card"]) ,
});
router.post("/checkout", requireAuth, async (req, res) => {
	const parsed = checkoutSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		const { data: cart } = await supabase.from("carts").select("*").eq("user_id", (req as any).user.id).maybeSingle();
		if (!cart) return res.status(400).json({ error: "Cart is empty" });
		const { data: items } = await supabase.from("cart_items").select("product_id, quantity, price_cents").eq("cart_id", cart.id);
		const fare = calculatePriceFromPoints(parsed.data.origin, parsed.data.destination);
		const itemsTotal = (items ?? []).reduce((s, i) => s + i.price_cents * i.quantity, 0);
		const amount = itemsTotal + fare.total;
		const { data: order, error } = await supabase.from("orders").insert({ customer_id: (req as any).user.id, store_id: cart.store_id, origin: parsed.data.origin, destination: parsed.data.destination, amount, status: "pending", payment_method: parsed.data.payment_method, distance_km: fare.distanceKm }).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		if (items?.length) await supabase.from("order_items").insert(items.map(i => ({ ...i, order_id: order.id })));
		await supabase.from("carts").delete().eq("id", cart.id);
		return res.status(201).json({ order });
	} catch (e: any) { return res.status(500).json({ error: e.message }); }
});

export default router;