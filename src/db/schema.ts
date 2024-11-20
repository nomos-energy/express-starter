import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";

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
