import type {
  User,
  UpsertUser,
  Deck,
  InsertDeck,
  Card,
  InsertCard,
  Spread,
  InsertSpread,
} from "@shared/schema";
import type { IStorage } from "./storage";

// In-memory storage for development testing
class MockStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private decks: Map<string, Deck> = new Map();
  private cards: Map<string, Card> = new Map();
  private spreads: Map<string, Spread> = new Map();

  constructor() {
    console.log("🔧 Using mock storage for development");
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || `user-${Date.now()}`,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    console.log("👤 Mock user created/updated:", user.email);
    return user;
  }

  // Deck operations
  async getUserDecks(userId: string): Promise<Deck[]> {
    const userDecks = Array.from(this.decks.values()).filter(deck => deck.userId === userId);
    console.log(`📚 Found ${userDecks.length} mock decks for user ${userId}`);
    return userDecks;
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    return this.decks.get(id);
  }

  async createDeck(userId: string, deckData: InsertDeck): Promise<Deck> {
    const deck: Deck = {
      id: `deck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: deckData.name,
      description: deckData.description || null,
      cardBackImageUrl: deckData.cardBackImageUrl || null,
      thumbnailUrl: deckData.thumbnailUrl || null,
      isPublished: deckData.isPublished || false,
      publishType: deckData.publishType || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.decks.set(deck.id, deck);
    console.log("🃏 Mock deck created:", deck.name, deck.id);
    return deck;
  }

  async updateDeck(id: string, deckData: Partial<InsertDeck>): Promise<Deck> {
    const existingDeck = this.decks.get(id);
    if (!existingDeck) {
      throw new Error("Deck not found");
    }
    
    const updatedDeck: Deck = {
      ...existingDeck,
      ...deckData,
      updatedAt: new Date(),
    };
    this.decks.set(id, updatedDeck);
    console.log("📝 Mock deck updated:", updatedDeck.name);
    return updatedDeck;
  }

  async deleteDeck(id: string): Promise<void> {
    // Also delete associated cards and spreads
    Array.from(this.cards.values())
      .filter(card => card.deckId === id)
      .forEach(card => this.cards.delete(card.id));
    
    Array.from(this.spreads.values())
      .filter(spread => spread.deckId === id)
      .forEach(spread => this.spreads.delete(spread.id));
    
    this.decks.delete(id);
    console.log("🗑️ Mock deck deleted:", id);
  }

  // Card operations
  async getDeckCards(deckId: string): Promise<Card[]> {
    const deckCards = Array.from(this.cards.values()).filter(card => card.deckId === deckId);
    console.log(`🃏 Found ${deckCards.length} mock cards for deck ${deckId}`);
    return deckCards;
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(deckId: string, cardData: InsertCard): Promise<Card> {
    const card: Card = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deckId,
      cardNumber: cardData.cardNumber,
      name: cardData.name,
      frontImageUrl: cardData.frontImageUrl || null,
      overallMeaning: cardData.overallMeaning || null,
      uprightInterpretation: cardData.uprightInterpretation || null,
      reversedInterpretation: cardData.reversedInterpretation || null,
      historyLore: cardData.historyLore || null,
      symbolism: cardData.symbolism || null,
      notes: cardData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cards.set(card.id, card);
    console.log("🃏 Mock card created:", card.name, card.id);
    return card;
  }

  async updateCard(id: string, cardData: Partial<InsertCard>): Promise<Card> {
    const existingCard = this.cards.get(id);
    if (!existingCard) {
      throw new Error("Card not found");
    }
    
    const updatedCard: Card = {
      ...existingCard,
      ...cardData,
      updatedAt: new Date(),
    };
    this.cards.set(id, updatedCard);
    console.log("📝 Mock card updated:", updatedCard.name);
    return updatedCard;
  }

  async deleteCard(id: string): Promise<void> {
    this.cards.delete(id);
    console.log("🗑️ Mock card deleted:", id);
  }

  // Spread operations
  async getDeckSpreads(deckId: string): Promise<Spread[]> {
    const deckSpreads = Array.from(this.spreads.values()).filter(spread => spread.deckId === deckId);
    console.log(`🔮 Found ${deckSpreads.length} mock spreads for deck ${deckId}`);
    return deckSpreads;
  }

  async getSpread(id: string): Promise<Spread | undefined> {
    return this.spreads.get(id);
  }

  async createSpread(deckId: string, spreadData: InsertSpread): Promise<Spread> {
    const spread: Spread = {
      id: `spread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deckId,
      name: spreadData.name,
      description: spreadData.description || null,
      cardCount: spreadData.cardCount,
      positions: spreadData.positions,
      createdAt: new Date(),
    };
    this.spreads.set(spread.id, spread);
    console.log("🔮 Mock spread created:", spread.name, spread.id);
    return spread;
  }

  async updateSpread(id: string, spreadData: Partial<InsertSpread>): Promise<Spread> {
    const existingSpread = this.spreads.get(id);
    if (!existingSpread) {
      throw new Error("Spread not found");
    }
    
    const updatedSpread: Spread = {
      ...existingSpread,
      ...spreadData,
    };
    this.spreads.set(id, updatedSpread);
    console.log("📝 Mock spread updated:", updatedSpread.name);
    return updatedSpread;
  }

  async deleteSpread(id: string): Promise<void> {
    this.spreads.delete(id);
    console.log("🗑️ Mock spread deleted:", id);
  }
}

// Export using both ES modules and CommonJS for compatibility
export { MockStorage };
module.exports = { MockStorage };
