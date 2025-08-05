import { Card, CardContent } from "@/components/ui/card";
import { Archive, Wand2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative z-10">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-12">
          <h1 className="mystical-font text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Welcome Back to the Codex
          </h1>
          <p className="text-cosmic-300 text-lg">Choose your mystical path</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vault Tile */}
          <Link href="/vault">
            <Card className="card-glow rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 celestial-glow group border-mystic-600/20">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Archive className="w-12 h-12 mx-auto text-celestial-400 group-hover:animate-pulse" />
                </div>
                <h2 className="mystical-font text-2xl font-semibold mb-4 text-white group-hover:text-celestial-300">
                  🔮 Vault
                </h2>
                <p className="text-cosmic-300 group-hover:text-cosmic-200">
                  Your personal collection of mystical decks awaits. Explore, publish, and share your creations with the world.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Altar Tile */}
          <Link href="/altar">
            <Card className="card-glow rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 celestial-glow group border-mystic-600/20">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Wand2 className="w-12 h-12 mx-auto text-celestial-400 group-hover:animate-pulse" />
                </div>
                <h2 className="mystical-font text-2xl font-semibold mb-4 text-white group-hover:text-celestial-300">
                  🕯️ Altar
                </h2>
                <p className="text-cosmic-300 group-hover:text-cosmic-200">
                  The sacred space where new decks are born. Channel your creativity and craft something truly magical.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
