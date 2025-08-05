import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Decks table
export const decks = pgTable("decks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  cardBackImageUrl: varchar("card_back_image_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  isPublished: boolean("is_published").default(false),
  publishType: varchar("publish_type"), // 'virtual' | 'physical' | null
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cards table
export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deckId: varchar("deck_id").notNull().references(() => decks.id, { onDelete: "cascade" }),
  cardNumber: integer("card_number").notNull(),
  name: text("name").notNull(),
  frontImageUrl: varchar("front_image_url"),
  overallMeaning: text("overall_meaning"),
  uprightInterpretation: text("upright_interpretation"),
  reversedInterpretation: text("reversed_interpretation"),
  historyLore: text("history_lore"),
  symbolism: text("symbolism"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Spreads table
export const spreads = pgTable("spreads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deckId: varchar("deck_id").notNull().references(() => decks.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  cardCount: integer("card_count").notNull(),
  positions: jsonb("positions").notNull(), // Array of position objects with name and coordinates
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Deck = typeof decks.$inferSelect;
export type InsertDeck = typeof decks.$inferInsert;

export type Card = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;

export type Spread = typeof spreads.$inferSelect;
export type InsertSpread = typeof spreads.$inferInsert;

// Insert schemas
export const insertDeckSchema = createInsertSchema(decks).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  deckId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpreadSchema = createInsertSchema(spreads).omit({
  id: true,
  deckId: true,
  createdAt: true,
});
