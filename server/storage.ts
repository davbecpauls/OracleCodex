import {
  users,
  decks,
  cards,
  spreads,
  type User,
  type UpsertUser,
  type Deck,
  type InsertDeck,
  type Card,
  type InsertCard,
  type Spread,
  type InsertSpread,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Deck operations
  getUserDecks(userId: string): Promise<Deck[]>;
  getDeck(id: string): Promise<Deck | undefined>;
  createDeck(userId: string, deck: InsertDeck): Promise<Deck>;
  updateDeck(id: string, deck: Partial<InsertDeck>): Promise<Deck>;
  deleteDeck(id: string): Promise<void>;
  
  // Card operations
  getDeckCards(deckId: string): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(deckId: string, card: InsertCard): Promise<Card>;
  updateCard(id: string, card: Partial<InsertCard>): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  
  // Spread operations
  getDeckSpreads(deckId: string): Promise<Spread[]>;
  getSpread(id: string): Promise<Spread | undefined>;
  createSpread(deckId: string, spread: InsertSpread): Promise<Spread>;
  updateSpread(id: string, spread: Partial<InsertSpread>): Promise<Spread>;
  deleteSpread(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Deck operations
  async getUserDecks(userId: string): Promise<Deck[]> {
    return await db.select().from(decks).where(eq(decks.userId, userId));
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    return deck;
  }

  async createDeck(userId: string, deck: InsertDeck): Promise<Deck> {
    const [newDeck] = await db
      .insert(decks)
      .values({ ...deck, userId })
      .returning();
    return newDeck;
  }

  async updateDeck(id: string, deck: Partial<InsertDeck>): Promise<Deck> {
    const [updatedDeck] = await db
      .update(decks)
      .set({ ...deck, updatedAt: new Date() })
      .where(eq(decks.id, id))
      .returning();
    return updatedDeck;
  }

  async deleteDeck(id: string): Promise<void> {
    await db.delete(decks).where(eq(decks.id, id));
  }

  // Card operations
  async getDeckCards(deckId: string): Promise<Card[]> {
    return await db.select().from(cards).where(eq(cards.deckId, deckId));
  }

  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async createCard(deckId: string, card: InsertCard): Promise<Card> {
    const [newCard] = await db
      .insert(cards)
      .values({ ...card, deckId })
      .returning();
    return newCard;
  }

  async updateCard(id: string, card: Partial<InsertCard>): Promise<Card> {
    const [updatedCard] = await db
      .update(cards)
      .set({ ...card, updatedAt: new Date() })
      .where(eq(cards.id, id))
      .returning();
    return updatedCard;
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id));
  }

  // Spread operations
  async getDeckSpreads(deckId: string): Promise<Spread[]> {
    return await db.select().from(spreads).where(eq(spreads.deckId, deckId));
  }

  async getSpread(id: string): Promise<Spread | undefined> {
    const [spread] = await db.select().from(spreads).where(eq(spreads.id, id));
    return spread;
  }

  async createSpread(deckId: string, spread: InsertSpread): Promise<Spread> {
    const [newSpread] = await db
      .insert(spreads)
      .values({ ...spread, deckId })
      .returning();
    return newSpread;
  }

  async updateSpread(id: string, spread: Partial<InsertSpread>): Promise<Spread> {
    const [updatedSpread] = await db
      .update(spreads)
      .set(spread)
      .where(eq(spreads.id, id))
      .returning();
    return updatedSpread;
  }

  async deleteSpread(id: string): Promise<void> {
    await db.delete(spreads).where(eq(spreads.id, id));
  }
}

export const storage = new DatabaseStorage();
