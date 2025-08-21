import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getSupabaseAdmin } from "../lib/supabase";
const router = Router();
const signupSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["client", "driver", "admin"]).default("client") });
router.post("/signup", async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const password_hash = await bcrypt.hash(parsed.data.password, 10);
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from("users").insert({ name: parsed.data.name, email: parsed.data.email, type: parsed.data.role, password_hash, approval_status: parsed.data.role === "driver" ? "pending" : "approved" }).select("*").single();
        if (error)
            return res.status(500).json({ error: error.message });
        return res.status(201).json({ user: data });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const supabase = getSupabaseAdmin();
        const { data: user, error } = await supabase.from("users").select("id, password_hash, type, approval_status").eq("email", parsed.data.email).single();
        if (error || !user)
            return res.status(401).json({ error: "Invalid credentials" });
        const ok = await bcrypt.compare(parsed.data.password, user.password_hash ?? "");
        if (!ok)
            return res.status(401).json({ error: "Invalid credentials" });
        if (user.type === "driver" && user.approval_status !== "approved")
            return res.status(403).json({ error: "Driver not approved" });
        const token = jwt.sign({ userId: user.id, role: user.type }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
        return res.json({ token });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
const otpRequestSchema = z.object({ destination: z.string(), purpose: z.enum(["login", "verify", "reset_password"]) });
router.post("/otp/request", async (req, res) => {
    const parsed = otpRequestSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from("otp_codes").insert({ destination: parsed.data.destination, code, purpose: parsed.data.purpose, expires_at }).select("id").single();
        if (error)
            return res.status(500).json({ error: error.message });
        // TODO: Integrate SMS/Email provider to send the code
        return res.json({ requestId: data.id });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
const otpVerifySchema = z.object({ destination: z.string(), code: z.string().length(6), purpose: z.enum(["login", "verify", "reset_password"]) });
router.post("/otp/verify", async (req, res) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const supabase = getSupabaseAdmin();
        const { data: row, error } = await supabase.from("otp_codes").select("id, user_id, expires_at, consumed_at").eq("destination", parsed.data.destination).eq("code", parsed.data.code).eq("purpose", parsed.data.purpose).order("expires_at", { ascending: false }).limit(1).single();
        if (error || !row)
            return res.status(400).json({ error: "Invalid code" });
        if (row.consumed_at)
            return res.status(400).json({ error: "Code already used" });
        if (new Date(row.expires_at).getTime() < Date.now())
            return res.status(400).json({ error: "Code expired" });
        await supabase.from("otp_codes").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
        // For login by OTP, create user if not exists
        let userId = row.user_id;
        if (!userId) {
            const { data: user } = await supabase.from("users").insert({ email: parsed.data.destination, type: "client", approval_status: "approved" }).select("id").single();
            userId = user?.id;
        }
        const token = jwt.sign({ userId, role: "client" }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
        return res.json({ token });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
// Social login placeholder
router.post("/social", (_req, res) => {
    return res.json({ message: "Social login stub - integrate Google/Facebook/Apple" });
});
export default router;
