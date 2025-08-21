import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";
const router = Router();
router.get("/order/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("ratings").select("*").eq("order_id", orderId);
    if (error)
        return res.status(500).json({ error: error.message });
    return res.json({ ratings: data });
});
const rateSchema = z.object({ order_id: z.string().uuid(), ratee_user_id: z.string().uuid(), type: z.enum(["store", "driver"]), score: z.number().int().min(1).max(5), comment: z.string().optional() });
router.post("/", requireAuth, async (req, res) => {
    const parsed = rateSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("ratings").insert({ ...parsed.data, rater_user_id: req.user.id }).select("*").single();
    if (error)
        return res.status(500).json({ error: error.message });
    return res.status(201).json({ rating: data });
});
export default router;
