import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";

const router = Router();

const registerSchema = z.object({
	user_id: z.string().uuid(),
	token: z.string().min(10),
	platform: z.enum(["ios","android","web"]).optional(),
});

router.post("/register", async (req, res) => {
	const parsed = registerSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("device_tokens").upsert({
			user_id: parsed.data.user_id,
			token: parsed.data.token,
			platform: parsed.data.platform,
		}).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		res.status(201).json({ token: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

export default router;