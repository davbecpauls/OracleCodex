# Obscura Codex - Tarot & Oracle Deck Creator

## Overview

Obscura Codex is a fully functional mystical web platform for creating, organizing, and publishing custom tarot and oracle decks. The application features a cosmic-themed dark UI with purple-to-gold gradients, twinkling star animations, and celestial golden accents that create an enchanting user experience. Users can craft detailed deck cards with comprehensive interpretations, design custom reading spreads, and manage their mystical collections through an intuitive workflow from creation to publication.

## Recent Changes (August 2025)
- ✓ Complete application setup with cosmic theming implemented
- ✓ Authentication system successfully integrated with Replit Auth
- ✓ Database schema deployed and working with PostgreSQL
- ✓ All core pages implemented: Landing, Home, Vault, Altar, Card Creator, Deck Preview, Spread Creator, Profile
- ✓ File upload system configured for card artwork and deck thumbnails
- ✓ Responsive navigation with mystical styling and mobile support
- ✓ Twinkling stars background animation and cosmic gradients applied
- ✓ Successfully migrated from Replit Agent to Replit environment (August 6, 2025)
- ✓ Enhanced admin interface with cleaner deck management and publishing options
- ✓ Added virtual reading functionality for in-app tarot readings with interactive spreads
- ✓ Implemented card drawing system with reversal mechanics and position-based interpretations
- ✓ Created comprehensive deck preview with publishing status indicators

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React 18** using **TypeScript** and follows a component-based architecture. The UI framework leverages **shadcn/ui** components built on top of **Radix UI** primitives, providing a consistent and accessible design system. The styling is implemented using **Tailwind CSS** with custom CSS variables for the mystical dark theme featuring cosmic and celestial color schemes.

**State Management**: Uses **TanStack Query (React Query)** for server state management, caching, and synchronization. This eliminates the need for complex client-side state management libraries while providing automatic background updates and optimistic updates.

**Routing**: Implements **Wouter** as a lightweight alternative to React Router, providing simple declarative routing without the overhead of larger routing libraries.

**Build System**: Uses **Vite** as the build tool and development server, configured with custom aliases for clean imports and optimized for both development and production environments.

### Backend Architecture
The server follows a **RESTful API** design pattern built with **Express.js** and **TypeScript**. The architecture separates concerns into distinct layers:

**Route Layer**: Handles HTTP request routing and middleware application, including authentication checks and request validation.

**Storage Layer**: Implements a storage interface pattern with a PostgreSQL implementation, providing abstraction over database operations and enabling easy testing or database provider switching.

**Database Layer**: Uses **Drizzle ORM** with **Neon Database** (PostgreSQL) for type-safe database operations and schema management.

### Data Storage Solutions
**Primary Database**: PostgreSQL via Neon Database for all persistent data including users, decks, cards, spreads, and sessions.

**Session Storage**: PostgreSQL-backed session storage using `connect-pg-simple` for persistent user sessions across server restarts.

**File Storage**: Implements file upload handling with **Multer** for user-uploaded images (card artwork, deck thumbnails), though the storage destination is configurable.

**Schema Design**: The database schema includes:
- Users table with profile information
- Decks table with metadata and publishing options
- Cards table with detailed tarot interpretation fields
- Spreads table with JSON-based position configurations
- Sessions table for authentication state

### Authentication and Authorization
**Authentication Provider**: Integrates with **Replit's OpenID Connect (OIDC)** authentication system using the `openid-client` library and Passport.js strategy.

**Session Management**: Implements server-side sessions with PostgreSQL storage, providing secure session persistence and automatic cleanup.

**Authorization Pattern**: Uses middleware-based route protection with `isAuthenticated` guards that verify user sessions before allowing access to protected resources.

**User Management**: Supports user profile management with automatic user creation/update on authentication and profile image handling.

### External Dependencies

**Authentication Services**:
- Replit OIDC for user authentication and identity management
- OpenID Connect protocol implementation

**Database Services**:
- Neon Database (PostgreSQL) for primary data storage
- Connection pooling via `@neondatabase/serverless`

**UI Component Libraries**:
- Radix UI primitives for accessible component foundations
- shadcn/ui for pre-built component implementations
- Lucide React for consistent iconography

**Development Tools**:
- Replit development environment integration
- Vite plugins for development experience enhancement
- TypeScript for type safety across the entire application

**File Processing**:
- Multer for multipart form data and file upload handling
- Image format validation for uploaded artwork

**Styling and Theming**:
- Tailwind CSS for utility-first styling
- PostCSS for CSS processing
- Custom CSS variables for theme management

The application is designed to be deployed on Replit's platform with specific integrations for their development environment, authentication system, and database provisioning, while maintaining flexibility for potential deployment to other platforms.