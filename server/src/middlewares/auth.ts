import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthTokenPayload {
	userId: string;
	role: "client" | "driver" | "admin";
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ error: "Missing bearer token" });
	try {
		const secret = process.env.JWT_SECRET || "dev-secret";
		const decoded = jwt.verify(token, secret) as AuthTokenPayload;
		(req as any).user = { id: decoded.userId, role: decoded.role };
		return next();
	} catch (e: any) {
		return res.status(401).json({ error: "Invalid token" });
	}
}