import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL!;

const local = process.env.POSTGRES_URL!.includes("localhost");

export const client = postgres(connectionString, {
  prepare: false,
  port: local ? 5432 : 6543,
});

export const db = drizzle(client, { schema });
