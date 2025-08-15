import { Request, Response, NextFunction } from "express";

export function requireAuth(_req: Request, _res: Response, next: NextFunction) {
	// TODO: validate Supabase JWT and attach user to request
	next();
}