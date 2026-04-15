import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");
  await pool.query(sql);
  await pool.end();
  // eslint-disable-next-line no-console
  console.log("Schema applied");
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  await pool.end().catch(() => {});
  process.exit(1);
});

