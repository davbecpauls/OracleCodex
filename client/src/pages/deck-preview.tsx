import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Play, Edit, Plus } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import type { Deck, Card as DeckCard, Spread } from "@shared/schema";

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

  const { data: spreads } = useQuery<Spread[]>({
    queryKey: ["/api/decks", deckId, "spreads"],
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
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge className="bg-mystic-800 text-mystic-300">
                      {cards?.length || 0} Cards
                    </Badge>
                    <Badge className="bg-cosmic-800 text-cosmic-300">
                      {spreads?.length || 0} Spreads
                    </Badge>
                    <Badge 
                      className={`${
                        deck.isPublished 
                          ? 'bg-green-900/50 text-green-300' 
                          : 'bg-yellow-900/50 text-yellow-300'
                      }`}
                    >
                      {deck.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {deck.publishType && (
                      <Badge className="bg-celestial-900/50 text-celestial-300">
                        {deck.publishType === 'virtual' ? 'Virtual Reading' : 'Physical Print'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-cosmic-400 text-sm">
                    Created {deck.createdAt ? new Date(deck.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
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

        {/* Admin Actions */}
        <Card className="card-glow rounded-xl mb-8 border-mystic-600/20">
          <CardContent className="p-6">
            <h3 className="mystical-font text-xl font-semibold mb-4 text-celestial-300">
              Deck Management
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href={`/card-creator/${deckId}`}>
                <Button className="w-full bg-gradient-to-r from-mystic-600 to-mystic-500 hover:from-mystic-500 hover:to-mystic-400 text-white" data-testid="button-edit-cards">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Cards
                </Button>
              </Link>
              
              <Link href={`/spread-creator/${deckId}`}>
                <Button className="w-full bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-500 hover:to-cosmic-400 text-white" data-testid="button-edit-spreads">
                  <Plus className="w-4 h-4 mr-2" />
                  {spreads?.length ? 'Edit Spreads' : 'Create Spreads'}
                </Button>
              </Link>

              {(cards?.length || 0) > 0 && (spreads?.length || 0) > 0 && (
                <Link href={`/reading/${deckId}`}>
                  <Button className="w-full bg-gradient-to-r from-celestial-600 to-celestial-500 hover:from-celestial-500 hover:to-celestial-400 text-white" data-testid="button-start-reading">
                    <Play className="w-4 h-4 mr-2" />
                    Start Reading
                  </Button>
                </Link>
              )}

              <Link href="/vault">
                <Button 
                  variant="outline"
                  className="w-full border-cosmic-600 text-cosmic-300 hover:bg-cosmic-800"
                  data-testid="button-back-vault"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Vault
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Status & Actions */}
        <Card className="card-glow rounded-xl border-mystic-600/20">
          <CardContent className="p-6">
            <h3 className="mystical-font text-xl font-semibold mb-4 text-celestial-300">
              Publishing Options
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-800/30">
                <div>
                  <h4 className="font-semibold text-white mb-1">Virtual Reading</h4>
                  <p className="text-cosmic-400 text-sm">Enable in-app tarot readings and spreads</p>
                </div>
                <Badge 
                  className={`${
                    deck && deck.publishType === 'virtual' 
                      ? 'bg-green-900/50 text-green-300' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {deck && deck.publishType === 'virtual' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-800/30">
                <div>
                  <h4 className="font-semibold text-white mb-1">Physical Publishing</h4>
                  <p className="text-cosmic-400 text-sm">Prepare deck for print-on-demand or physical production</p>
                </div>
                <Badge 
                  className={`${
                    deck && deck.publishType === 'physical' 
                      ? 'bg-green-900/50 text-green-300' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {deck && deck.publishType === 'physical' ? 'Ready' : 'Not Ready'}
                </Badge>
              </div>
              
              {(cards?.length || 0) === 0 && (
                <div className="text-center py-6">
                  <p className="text-cosmic-400 mb-4">Add cards to your deck before publishing</p>
                  <Link href={`/card-creator/${deckId}`}>
                    <Button className="bg-gradient-to-r from-celestial-600 to-mystic-600 hover:from-celestial-500 hover:to-mystic-500" data-testid="button-add-first-card">
                      Add Your First Card
                    </Button>
                  </Link>
                </div>
              )}

              {(spreads?.length || 0) === 0 && (cards?.length || 0) > 0 && (
                <div className="text-center py-6">
                  <p className="text-cosmic-400 mb-4">Create spreads to enable virtual readings</p>
                  <Link href={`/spread-creator/${deckId}`}>
                    <Button className="bg-gradient-to-r from-celestial-600 to-mystic-600 hover:from-celestial-500 hover:to-mystic-500" data-testid="button-create-first-spread">
                      Create Your First Spread
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
