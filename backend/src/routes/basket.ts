import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const basketRouter = Router();

basketRouter.get("/", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const result = await pool.query(
    `select
       bi.product_id as "productId",
       bi.quantity as quantity,
       p.name,
       p.price_label as price,
       p.image,
       p.stock,
       p.seller
     from basket_items bi
     join products p on p.id = bi.product_id
     where bi.user_id = $1
     order by p.name asc`,
    [userId]
  );

  res.json({ items: result.rows });
});

const setSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ),
});

basketRouter.put("/", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = setSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("delete from basket_items where user_id = $1", [userId]);

    for (const item of parsed.data.items) {
      await client.query(
        `insert into basket_items (user_id, product_id, quantity)
         values ($1, $2, $3)`,
        [userId, item.productId, item.quantity]
      );
    }

    await client.query("commit");
    res.json({ ok: true });
  } catch {
    await client.query("rollback");
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

basketRouter.delete("/", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  await pool.query("delete from basket_items where user_id = $1", [userId]);
  res.json({ ok: true });
});

