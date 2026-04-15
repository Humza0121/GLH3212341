import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { basketRouter } from "./routes/basket.js";
import { ordersRouter } from "./routes/orders.js";
import { pool } from "./db/pool.js";
import { seedProducts } from "./seed/seed-products.js";

const port = Number(process.env.PORT || 5050);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:8080";
const corsOrigins = corsOrigin
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin(origin, cb) {
      // Allow server-to-server / curl / same-origin requests
      if (!origin) return cb(null, true);

      // Allow explicit env origins (comma-separated)
      if (corsOrigins.includes(origin)) return cb(null, true);

      // Dev-friendly localhost variants (IPv4 + IPv6 + any port)
      if (
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /^https?:\/\/\[(::1)\](:\d+)?$/.test(origin)
      ) {
        return cb(null, true);
      }

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.get("/health", async (_req, res) => {
  const result = await pool.query("select 1 as ok");
  res.json({ ok: true, db: result.rows[0]?.ok === 1 });
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/basket", basketRouter);
app.use("/orders", ordersRouter);

await seedProducts();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
});

