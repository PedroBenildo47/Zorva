import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { registerRoutes } from "./routes";
const app = express();
// Health first
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Security and CORS
app.use(helmet());
app.use(cors());
// JSON body for all non-raw routes is applied inside registerRoutes
// where Stripe webhook uses express.raw()
app.use(express.json({ limit: "1mb" }));
registerRoutes(app);
const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Zorva API listening on http://localhost:${port}`);
});
