import { Router } from "express";
import { z } from "zod";
import { getSupabaseAdmin } from "../lib/supabase";
import { calculatePriceFromPoints } from "@zorva/shared";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });
const router = Router();
router.get("/", async (_req, res) => {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);
        if (error)
            return res.status(500).json({ error: error.message });
        res.json({ orders: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
const createOrder = z.object({
    customer_id: z.string().uuid(),
    origin: z.object({ lat: z.number(), lng: z.number(), address: z.string().optional() }),
    destination: z.object({ lat: z.number(), lng: z.number(), address: z.string().optional() }),
    payment_method: z.enum(["card", "cash"]),
    store_id: z.string().uuid().optional(),
    items: z.array(z.object({ product_id: z.string().uuid(), quantity: z.number().int().positive(), price_cents: z.number().int().positive() })).optional()
});
router.post("/", async (req, res) => {
    const parsed = createOrder.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { origin, destination } = parsed.data;
    const price = calculatePriceFromPoints(origin, destination);
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("orders")
            .insert({
            customer_id: parsed.data.customer_id,
            status: "pending",
            amount: price.total,
            origin,
            destination,
            payment_method: parsed.data.payment_method,
            distance_km: price.distanceKm,
            store_id: parsed.data.store_id,
        })
            .select("*")
            .single();
        if (error)
            return res.status(500).json({ error: error.message });
        if (parsed.data.items?.length) {
            await supabase.from("order_items").insert(parsed.data.items.map(i => ({ ...i, order_id: data.id })));
        }
        res.status(201).json({ order: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
const updateStatus = z.object({ status: z.enum(["pending", "accepted", "enroute", "delivered", "canceled"]) });
router.patch("/:id/status", async (req, res) => {
    const io = req.app.get("io");
    const id = req.params.id;
    const parsed = updateStatus.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from("orders").update({ status: parsed.data.status }).eq("id", id).select("*").single();
        if (error)
            return res.status(500).json({ error: error.message });
        io?.to(`order:${id}`).emit("order-status", data.status);
        res.json({ order: data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/:id/pay", async (req, res) => {
    const id = req.params.id;
    try {
        const supabase = getSupabaseAdmin();
        const { data: order, error } = await supabase.from("orders").select("id, amount").eq("id", id).single();
        if (error || !order)
            return res.status(404).json({ error: error?.message ?? "Order not found" });
        const intent = await stripe.paymentIntents.create({
            amount: order.amount,
            currency: "brl",
            automatic_payment_methods: { enabled: true },
        });
        res.json({ clientSecret: intent.client_secret });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
export default router;
