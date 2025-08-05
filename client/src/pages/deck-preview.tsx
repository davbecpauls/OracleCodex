import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import type { Deck, Card as DeckCard } from "@shared/schema";

export default function DeckPreview() {
  const params = useParams();
  const deckId = params.deckId;
  const [, setLocation] = useLocation();

  const { data: deck } = useQuery<Deck>({
    queryKey: ["/api/decks", deckId],
    enabled: !!deckId,
  });

  const { data: cards } = useQuery<DeckCard[]>({
    queryKey: ["/api/decks", deckId, "cards"],
    enabled: !!deckId,
  });

  if (!deckId) {
    return <div>Deck ID required</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Deck Preview
          </h1>
          <p className="text-cosmic-300 text-lg">Review your mystical creation</p>
        </div>

        {/* Deck Info */}
        {deck && (
          <Card className="card-glow rounded-xl mb-8 border-mystic-600/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {deck.thumbnailUrl ? (
                  <img 
                    src={deck.thumbnailUrl} 
                    alt={deck.name}
                    className="w-48 h-64 object-cover rounded-lg shadow-lg" 
                  />
                ) : (
                  <div className="w-48 h-64 bg-cosmic-800 rounded-lg flex items-center justify-center">
                    <span className="text-cosmic-400">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="mystical-font text-2xl font-semibold mb-4 text-celestial-300">
                    {deck.name}
                  </h2>
                  <p className="text-cosmic-300 mb-4">
                    {deck.description || "No description available"}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-cosmic-400">Total Cards:</span>
                      <span className="text-white ml-2">{cards?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-cosmic-400">Created:</span>
                      <span className="text-white ml-2">
                        {deck.createdAt ? new Date(deck.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="text-cosmic-400">Status:</span>
                      <span className="text-celestial-400 ml-2">
                        {deck.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div>
                      <span className="text-cosmic-400">Type:</span>
                      <span className="text-white ml-2">Oracle</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card Gallery */}
        <Card className="card-glow rounded-xl mb-8 border-mystic-600/20">
          <CardContent className="p-8">
            <h3 className="mystical-font text-xl font-semibold mb-6 text-celestial-300">
              Card Gallery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cards?.map((card) => (
                <div 
                  key={card.id}
                  className="group cursor-pointer"
                  title={`${card.cardNumber}. ${card.name}`}
                >
                  {card.frontImageUrl ? (
                    <img 
                      src={card.frontImageUrl} 
                      alt={card.name}
                      className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <div className="w-full h-32 bg-cosmic-800 rounded-lg flex items-center justify-center border border-mystic-600">
                      <span className="text-cosmic-400 text-xs text-center">
                        {card.cardNumber}.<br />{card.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add More Cards Placeholder */}
              <Link href={`/card-creator/${deckId}`}>
                <div className="w-full h-32 bg-cosmic-800 rounded-lg border-2 border-dashed border-mystic-600 hover:border-celestial-500 flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-mystic-400 text-2xl">+</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/vault" className="flex-1">
            <Button 
              variant="outline"
              className="w-full bg-cosmic-700 hover:bg-cosmic-600 text-white border-cosmic-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vault
            </Button>
          </Link>
          <Link href={`/spread-creator/${deckId}`} className="flex-1">
            <Button className="w-full mystic-gradient hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-mystic-500/25 border-0">
              <BookOpen className="w-4 h-4 mr-2" />
              Generate Guidebook
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
