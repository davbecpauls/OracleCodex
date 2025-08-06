import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated as replitIsAuthenticated } from "./replitAuth";
import { setupDevAuth, isAuthenticated as devIsAuthenticated } from "./devAuth";
import { insertDeckSchema, insertCardSchema, insertSpreadSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Choose authentication based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  let isAuthenticated;
  
  if (isDevelopment) {
    console.log("🔧 Using development authentication");
    setupDevAuth(app);
    isAuthenticated = devIsAuthenticated;
  } else {
    console.log("🔒 Using Replit authentication");
    await setupAuth(app);
    isAuthenticated = replitIsAuthenticated;
  }

  // Auth routes - only register if not in development (devAuth handles these in dev mode)
  if (!isDevelopment) {
    app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    });
  }

  // Deck routes
  app.get('/api/decks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const decks = await storage.getUserDecks(userId);
      res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ message: "Failed to fetch decks" });
    }
  });

  app.get('/api/decks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const deck = await storage.getDeck(req.params.id);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      res.json(deck);
    } catch (error) {
      console.error("Error fetching deck:", error);
      res.status(500).json({ message: "Failed to fetch deck" });
    }
  });

  app.post('/api/decks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertDeckSchema.parse(req.body);
      const deck = await storage.createDeck(userId, { ...validatedData, userId });
      res.status(201).json(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ message: "Failed to create deck" });
    }
  });

  app.patch('/api/decks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDeckSchema.partial().parse(req.body);
      const deck = await storage.updateDeck(req.params.id, validatedData);
      res.json(deck);
    } catch (error) {
      console.error("Error updating deck:", error);
      res.status(500).json({ message: "Failed to update deck" });
    }
  });

  app.delete('/api/decks/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteDeck(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting deck:", error);
      res.status(500).json({ message: "Failed to delete deck" });
    }
  });

  // Card routes
  app.get('/api/decks/:deckId/cards', isAuthenticated, async (req: any, res) => {
    try {
      const cards = await storage.getDeckCards(req.params.deckId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.post('/api/decks/:deckId/cards', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(req.params.deckId, { ...validatedData, deckId: req.params.deckId });
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating card:", error);
      res.status(500).json({ message: "Failed to create card" });
    }
  });

  app.patch('/api/cards/:id', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertCardSchema.partial().parse(req.body);
      const card = await storage.updateCard(req.params.id, validatedData);
      res.json(card);
    } catch (error) {
      console.error("Error updating card:", error);
      res.status(500).json({ message: "Failed to update card" });
    }
  });

  app.delete('/api/cards/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteCard(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  // Spread routes
  app.get('/api/decks/:deckId/spreads', isAuthenticated, async (req: any, res) => {
    try {
      const spreads = await storage.getDeckSpreads(req.params.deckId);
      res.json(spreads);
    } catch (error) {
      console.error("Error fetching spreads:", error);
      res.status(500).json({ message: "Failed to fetch spreads" });
    }
  });

  app.post('/api/decks/:deckId/spreads', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertSpreadSchema.parse(req.body);
      const spread = await storage.createSpread(req.params.deckId, { ...validatedData, deckId: req.params.deckId });
      res.status(201).json(spread);
    } catch (error) {
      console.error("Error creating spread:", error);
      res.status(500).json({ message: "Failed to create spread" });
    }
  });

  // File upload routes
  app.post('/api/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // In a real application, you would upload to a cloud storage service
      // For now, return a mock URL
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
