import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Share } from "lucide-react";
import { Link } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Deck } from "@shared/schema";

export default function Vault() {
  const { toast } = useToast();

  const { data: decks, isLoading, error } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
    retry: false,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
              Your Mystical Vault
            </h1>
            <p className="text-cosmic-300 text-lg">Loading your collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Your Mystical Vault
          </h1>
          <p className="text-cosmic-300 text-lg">Your collection of enchanted decks</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {decks?.map((deck) => (
            <Card key={deck.id} className="card-glow rounded-xl transform hover:scale-105 transition-all duration-300 border-mystic-600/20">
              <CardContent className="p-6">
                {deck.thumbnailUrl ? (
                  <img 
                    src={deck.thumbnailUrl} 
                    alt={deck.name}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg" 
                  />
                ) : (
                  <div className="w-full h-48 bg-cosmic-800 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-cosmic-400">No Image</span>
                  </div>
                )}
                <h3 className="mystical-font text-lg font-semibold mb-2 text-celestial-300">
                  {deck.name}
                </h3>
                <p className="text-cosmic-400 text-sm mb-4 line-clamp-2">
                  {deck.description || "No description available"}
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-celestial-600 to-celestial-500 hover:from-celestial-500 hover:to-celestial-400 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-celestial-500/25 border-0"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Create New Deck Card */}
          <Link href="/altar">
            <Card className="card-glow rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-dashed border-mystic-600 hover:border-celestial-500 flex flex-col items-center justify-center min-h-[320px]">
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 text-mystic-400 mb-4 mx-auto" />
                <h3 className="mystical-font text-lg font-semibold mb-2 text-mystic-300">
                  Create New Deck
                </h3>
                <p className="text-cosmic-400 text-sm">
                  Begin crafting your next mystical masterpiece
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
