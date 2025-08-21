import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: "Missing bearer token" });
    try {
        const secret = process.env.JWT_SECRET || "dev-secret";
        const decoded = jwt.verify(token, secret);
        req.user = { id: decoded.userId, role: decoded.role };
        return next();
    }
    catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
