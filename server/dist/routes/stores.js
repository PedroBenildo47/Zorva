import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";
const router = Router();
router.get("/", async (_req, res) => {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from("stores").select("*").order("created_at", { ascending: false }).limit(100);
        if (error)
            return res.status(500).json({ error: error.message });
        res.json({ stores: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
const createSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    location: z.any().optional(),
});
router.post("/", requireAuth, async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("stores")
            .insert({ ...parsed.data, owner_user_id: req.user?.id })
            .select("*")
            .single();
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json({ store: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.patch("/:id/approve", requireAuth, async (req, res) => {
    if (req.user?.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });
    const id = req.params.id;
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from("stores").update({ is_approved: true }).eq("id", id).select("*").single();
        if (error)
            return res.status(500).json({ error: error.message });
        res.json({ store: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
export default router;
