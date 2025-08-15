import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";

const router = Router();

router.get("/me", async (req, res) => {
	// Placeholder: in real app, decode JWT and fetch profile by user id
	res.json({ message: "me endpoint placeholder" });
});

router.get("/", async (_req, res) => {
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("users").select("*").limit(50);
		if (error) return res.status(500).json({ error: error.message });
		res.json({ users: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

const upsertSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().nullable().optional(),
	email: z.string().email().nullable().optional(),
	phone: z.string().nullable().optional(),
	type: z.enum(["client", "driver", "admin"]),
});

router.post("/", async (req, res) => {
	const parsed = upsertSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("users").upsert(parsed.data).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		res.status(201).json({ user: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

export default router;