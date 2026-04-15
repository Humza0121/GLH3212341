import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import { signAccessToken } from "../auth/tokens.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional().nullable(),
  role: z.enum(["customer", "producer"]).default("customer"),
});

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const { email, password, phone, role } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `insert into users (email, password_hash, phone, role)
       values ($1, $2, $3, $4)
       returning id, email, phone, role, name, loyalty_points as "loyaltyPoints"`,
      [normalizedEmail, passwordHash, phone ?? null, role]
    );

    const user = result.rows[0];
    const token = signAccessToken({ sub: user.id });
    res.json({ token, user });
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "Account already exists" });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `select id, email, password_hash, phone, role, name, loyalty_points as "loyaltyPoints"
     from users
     where email = $1`,
    [normalizedEmail]
  );

  const row = result.rows[0];
  if (!row) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signAccessToken({ sub: row.id });
  const user = {
    id: row.id,
    email: row.email,
    phone: row.phone,
    role: row.role,
    name: row.name,
    loyaltyPoints: row.loyaltyPoints,
  };

  res.json({ token, user });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const result = await pool.query(
    `select id, email, phone, role, name, loyalty_points as "loyaltyPoints"
     from users
     where id = $1`,
    [userId]
  );

  const user = result.rows[0];
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
});

