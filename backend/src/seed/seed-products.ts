import { pool } from "../db/pool.js";

type SeedProduct = {
  id: string;
  name: string;
  price_label: string;
  image: string;
  stock: number;
  seller: string;
  category: string;
};

const products: SeedProduct[] = [
  { id: "1", name: "Lamb Chops", price_label: "£10/kg", image: "/assets/lamb-chops.jpg", stock: 15, seller: "Greenfield Farm", category: "meat" },
  { id: "2", name: "Lamb Ribs", price_label: "£12/kg", image: "/assets/lamb-ribs.jpg", stock: 8, seller: "Greenfield Farm", category: "meat" },
  { id: "3", name: "Chicken Breast", price_label: "£6.50/kg", image: "/assets/chicken-breast.jpg", stock: 20, seller: "Valley Poultry", category: "meat" },
  { id: "4", name: "Farmhouse Cheese", price_label: "£8/kg", image: "/assets/dairy-cheese.jpg", stock: 18, seller: "Meadow Dairy", category: "dairy" },
  { id: "5", name: "Sourdough Loaf", price_label: "£3.50/each", image: "/assets/bakery-bread.jpg", stock: 25, seller: "Village Bakery", category: "bakery" }
];

export async function seedProducts() {
  const existing = await pool.query("select count(*)::int as count from products");
  if (existing.rows[0]?.count > 0) return;

  for (const p of products) {
    await pool.query(
      `insert into products (id, name, price_label, image, stock, seller, category)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [p.id, p.name, p.price_label, p.image, p.stock, p.seller, p.category]
    );
  }
}

