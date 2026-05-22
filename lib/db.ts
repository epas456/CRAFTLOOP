import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";

const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
