import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
