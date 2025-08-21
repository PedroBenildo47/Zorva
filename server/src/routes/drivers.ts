import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/documents", requireAuth, async (req, res) => {
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase
			.from("driver_documents")
			.select("*")
			.eq("user_id", (req as any).user?.id)
			.order("submitted_at", { ascending: false });
		if (error) return res.status(500).json({ error: error.message });
		res.json({ documents: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

const uploadDocSchema = z.object({ type: z.string(), url: z.string().url() });
router.post("/documents", requireAuth, async (req, res) => {
	const parsed = uploadDocSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase
			.from("driver_documents")
			.insert({ user_id: (req as any).user?.id, ...parsed.data })
			.select("*")
			.single();
		if (error) return res.status(500).json({ error: error.message });
		res.status(201).json({ document: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

router.patch("/documents/:id/approve", requireAuth, async (req, res) => {
	if ((req as any).user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
	try {
		const supabase = getSupabaseAdmin();
		const { data, error } = await supabase.from("driver_documents").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", req.params.id).select("*").single();
		if (error) return res.status(500).json({ error: error.message });
		res.json({ document: data });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

export default router;