import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/store/:storeId", async (req, res) => {
	const { storeId } = req.params;
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("products").select("*").eq("store_id", storeId).order("name");
		if (error) return res.status(500).json({ error: error.message });
		res.json({ products: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

const upsertSchema = z.object({
	store_id: z.string().uuid(),
	name: z.string().min(2),
	description: z.string().optional(),
	photo_url: z.string().url().optional(),
	price_cents: z.number().int().positive(),
	is_available: z.boolean().optional(),
});

router.post("/", requireAuth, async (req, res) => {
	const parsed = upsertSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("products").insert(parsed.data).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		res.status(201).json({ product: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

router.patch("/:id", requireAuth, async (req, res) => {
	const id = req.params.id;
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("products").update(req.body).eq("id", id).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		res.json({ product: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

export default router;