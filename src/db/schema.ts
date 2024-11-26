import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  partnerId: integer("partner_id").references(() => partners.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  role: varchar("role", { length: 255 }).notNull(),
  scopes: jsonb("scopes").$type<string[]>().notNull(),
  partnerId: integer("partner_id").references(() => partners.id),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});
