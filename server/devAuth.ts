import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";

// Simple development authentication for local testing
export function setupDevAuth(app: Express) {
  console.log("🔧 Setting up development authentication (no real auth)");
  
  // Simple memory session store for development
  const MemStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    store: new MemStore({
      checkPeriod: 86400000 // 24 hours
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // HTTP for local dev
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Mock user for development
  const mockUser = {
    id: "dev-user-123",
    email: "dev@example.com",
    firstName: "Dev",
    lastName: "User",
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Development login endpoint - automatically logs in as mock user
  app.get('/api/login', async (req, res) => {
    console.log("🔧 Dev login: auto-authenticating mock user");
    console.log("👤 Mock user created/updated: dev@example.com");
    
    // Try to ensure user exists in database (but don't fail if DB is not available)
    try {
      await storage.upsertUser(mockUser);
      console.log("✅ Mock user created/updated in database");
    } catch (error) {
      console.warn("⚠️  Could not create mock user in database (this is okay for local testing):", error instanceof Error ? error.message : String(error));
    }
    
    (req.session as any).user = {
      claims: {
        sub: mockUser.id,
        email: mockUser.email,
        first_name: mockUser.firstName,
        last_name: mockUser.lastName,
        profile_image_url: mockUser.profileImageUrl,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
      },
      access_token: "dev-token",
      refresh_token: "dev-refresh-token",
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    };
    res.redirect('/');
  });

  // Development user endpoint
  app.get('/api/auth/user', async (req, res) => {
    const sessionUser = (req.session as any)?.user;
    if (!sessionUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Try to get user from database, fallback to mock user
    try {
      const dbUser = await storage.getUser(sessionUser.claims.sub);
      if (dbUser) {
        console.log("✅ Found user in database");
        res.json(dbUser);
      } else {
        console.log("📝 Using mock user (not found in database)");
        res.json(mockUser);
      }
    } catch (error) {
      console.warn("⚠️  Could not fetch user from database, using mock user:", error instanceof Error ? error.message : String(error));
      res.json(mockUser);
    }
  });

  // Development logout endpoint
  app.get('/api/logout', (req, res) => {
    req.session?.destroy(() => {
      res.redirect('/');
    });
  });

  // Development callback endpoint (for compatibility)
  app.get('/api/callback', (req, res) => {
    res.redirect('/api/login');
  });
}

// Simple authentication middleware for development
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any)?.user;
  
  if (!sessionUser || !sessionUser.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now > sessionUser.expires_at) {
    return res.status(401).json({ message: "Session expired" });
  }

  // Attach user to request for compatibility with existing code
  (req as any).user = sessionUser;
  next();
};
