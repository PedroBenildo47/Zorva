import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
const router = Router();
router.get("/:orderId", async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: true });
        if (error)
            return res.status(500).json({ error: error.message });
        res.json({ messages: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
const createMessage = z.object({
    order_id: z.string().uuid(),
    sender_id: z.string().uuid(),
    text: z.string().min(1),
});
router.post("/", async (req, res) => {
    const parsed = createMessage.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from("messages").insert(parsed.data).select("*").single();
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json({ message: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
export default router;
