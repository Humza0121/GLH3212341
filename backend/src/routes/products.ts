import { Router } from "express";
import { pool } from "../db/pool.js";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {
  const result = await pool.query(
    `select id, name, price_label as price, image, stock, seller, category
     from products
     order by created_at desc`
  );
  res.json({ products: result.rows });
});

