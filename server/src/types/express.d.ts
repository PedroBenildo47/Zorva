declare namespace Express {
	interface Request {
		rawBody?: string;
		user?: { id: string; role: "client" | "driver" | "admin" };
	}
}