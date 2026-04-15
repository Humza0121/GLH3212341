import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;

  const result = await pool.query(
    `select
       oi.id,
       oi.product_id as "productId",
       oi.name,
       oi.price_label as price,
       o.created_at as date
     from orders o
     join order_items oi on oi.order_id = o.id
     where o.user_id = $1
     order by o.created_at desc`,
    [userId]
  );

  res.json({ orders: result.rows });
});

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ),
});

function parsePricePence(priceLabel: string): number {
  const match = priceLabel.match(/([\d.]+)/);
  const n = match ? Number(match[1]) : 0;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

ordersRouter.post("/checkout", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");

    const orderRes = await client.query(
      `insert into orders (user_id, total_pence)
       values ($1, 0)
       returning id`,
      [userId]
    );
    const orderId = orderRes.rows[0].id as string;

    let totalPence = 0;
    let itemCount = 0;

    for (const item of parsed.data.items) {
      const productRes = await client.query(
        `select id, name, price_label, stock
         from products
         where id = $1`,
        [item.productId]
      );
      const product = productRes.rows[0];
      if (!product) {
        res.status(400).json({ error: "Invalid product" });
        await client.query("rollback");
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ error: "Not enough stock" });
        await client.query("rollback");
        return;
      }

      await client.query(
        `update products set stock = stock - $1 where id = $2`,
        [item.quantity, item.productId]
      );

      await client.query(
        `insert into order_items (order_id, product_id, name, price_label, quantity)
         values ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, product.name, product.price_label, item.quantity]
      );

      totalPence += parsePricePence(product.price_label) * item.quantity;
      itemCount += item.quantity;
    }

    await client.query(`update orders set total_pence = $1 where id = $2`, [
      totalPence,
      orderId,
    ]);

    await client.query(
      `update users set loyalty_points = loyalty_points + $1 where id = $2`,
      [itemCount, userId]
    );

    await client.query("delete from basket_items where user_id = $1", [userId]);

    const userRes = await client.query(
      `select id, email, phone, role, name, loyalty_points as "loyaltyPoints"
       from users
       where id = $1`,
      [userId]
    );

    await client.query("commit");
    res.json({ ok: true, user: userRes.rows[0] });
  } catch {
    await client.query("rollback");
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

