import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const db = new Database(":memory:");

db.exec(await Bun.file("drizzle/0000_loose_nemesis.sql").text());

export const orm = drizzle(db);
