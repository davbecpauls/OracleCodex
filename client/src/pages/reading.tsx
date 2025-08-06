import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, RotateCcw, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import type { Deck, Card as DeckCard, Spread } from "@shared/schema";

interface DrawnCard extends DeckCard {
  position?: string;
  isReversed?: boolean;
  positionMeaning?: string;
}

export default function Reading() {
  const params = useParams();
  const deckId = params.deckId;
  const [, setLocation] = useLocation();
  
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

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

  // Auto-select first spread if available
  useEffect(() => {
    if (spreads && spreads.length > 0 && !selectedSpread) {
      setSelectedSpread(spreads[0]);
    }
  }, [spreads, selectedSpread]);

  const shuffleAndDraw = () => {
    if (!cards || !selectedSpread) return;

    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const positions = selectedSpread.positions as Array<{name: string, meaning?: string}>;
    
    const drawn: DrawnCard[] = shuffledCards
      .slice(0, selectedSpread.cardCount)
      .map((card, index) => ({
        ...card,
        position: positions[index]?.name || `Position ${index + 1}`,
        positionMeaning: positions[index]?.meaning || "",
        isReversed: Math.random() < 0.3, // 30% chance of reversal
      }));

    setDrawnCards(drawn);
    setRevealedCards(new Set());
    setIsReading(true);
  };

  const toggleCardReveal = (cardId: string) => {
    const newRevealed = new Set(revealedCards);
    if (newRevealed.has(cardId)) {
      newRevealed.delete(cardId);
    } else {
      newRevealed.add(cardId);
    }
    setRevealedCards(newRevealed);
  };

  const resetReading = () => {
    setDrawnCards([]);
    setRevealedCards(new Set());
    setIsReading(false);
  };

  if (!deckId) {
    return <div>Deck ID required</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mystical-font text-4xl font-bold mb-2 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
              Virtual Reading
            </h1>
            <p className="text-cosmic-300 text-lg">
              {deck?.name || "Loading deck..."}
            </p>
          </div>
          <Link href="/vault">
            <Button variant="outline" className="border-cosmic-600 text-cosmic-300 hover:bg-cosmic-800" data-testid="button-back-vault">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vault
            </Button>
          </Link>
        </div>

        {/* Spread Selection */}
        {!isReading && spreads && spreads.length > 0 && (
          <Card className="card-glow rounded-xl mb-8 border-mystic-600/20">
            <CardContent className="p-6">
              <h3 className="mystical-font text-xl font-semibold mb-4 text-celestial-300">
                Choose Your Spread
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spreads.map((spread) => (
                  <div
                    key={spread.id}
                    onClick={() => setSelectedSpread(spread)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSpread?.id === spread.id
                        ? 'border-celestial-500 bg-celestial-900/20'
                        : 'border-mystic-600/50 hover:border-mystic-500'
                    }`}
                    data-testid={`spread-option-${spread.id}`}
                  >
                    <h4 className="font-semibold text-white mb-2">{spread.name}</h4>
                    <p className="text-cosmic-400 text-sm mb-2">{spread.description}</p>
                    <Badge variant="secondary" className="bg-mystic-800 text-mystic-300">
                      {spread.cardCount} cards
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reading Controls */}
        {selectedSpread && !isReading && (
          <div className="text-center mb-8">
            <Button
              onClick={shuffleAndDraw}
              className="bg-gradient-to-r from-celestial-600 to-mystic-600 hover:from-celestial-500 hover:to-mystic-500 text-white font-semibold text-lg px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-celestial-500/25"
              disabled={!cards || cards.length === 0}
              data-testid="button-draw-cards"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Draw Cards for {selectedSpread.name}
            </Button>
          </div>
        )}

        {/* Reading Results */}
        {isReading && drawnCards.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="mystical-font text-2xl font-semibold text-celestial-300">
                {selectedSpread?.name} Reading
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setRevealedCards(new Set(drawnCards.map(c => c.id)))}
                  variant="outline"
                  className="border-cosmic-600 text-cosmic-300 hover:bg-cosmic-800"
                  data-testid="button-reveal-all"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal All
                </Button>
                <Button
                  onClick={resetReading}
                  variant="outline"
                  className="border-mystic-600 text-mystic-300 hover:bg-mystic-800"
                  data-testid="button-reset-reading"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Reading
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {drawnCards.map((card, index) => {
                const isRevealed = revealedCards.has(card.id);
                return (
                  <Card
                    key={`${card.id}-${index}`}
                    className="card-glow rounded-xl border-mystic-600/20 cursor-pointer transform hover:scale-105 transition-all duration-300"
                    onClick={() => toggleCardReveal(card.id)}
                    data-testid={`card-${card.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Badge className="bg-celestial-900/50 text-celestial-300 mb-2">
                          {card.position}
                        </Badge>
                        {card.positionMeaning && (
                          <p className="text-xs text-cosmic-400">{card.positionMeaning}</p>
                        )}
                      </div>

                      {/* Card Back/Front */}
                      <div className="relative mb-4">
                        {!isRevealed ? (
                          <div className="w-full h-48 bg-gradient-to-br from-mystic-800 to-cosmic-900 rounded-lg flex items-center justify-center border-2 border-mystic-600">
                            <div className="text-center">
                              <EyeOff className="w-8 h-8 text-mystic-400 mx-auto mb-2" />
                              <p className="text-mystic-400 text-sm">Click to reveal</p>
                            </div>
                          </div>
                        ) : (
                          <div className={`relative ${card.isReversed ? 'transform rotate-180' : ''}`}>
                            {card.frontImageUrl ? (
                              <img 
                                src={card.frontImageUrl} 
                                alt={card.name}
                                className="w-full h-48 object-cover rounded-lg shadow-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-cosmic-800 rounded-lg flex items-center justify-center">
                                <span className="text-cosmic-400">No Image</span>
                              </div>
                            )}
                            {card.isReversed && (
                              <Badge className="absolute top-2 right-2 bg-red-900/80 text-red-300">
                                Reversed
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {isRevealed && (
                        <div className="space-y-3">
                          <h4 className="mystical-font text-lg font-semibold text-white">
                            {card.name}
                          </h4>
                          
                          {card.overallMeaning && (
                            <div>
                              <p className="text-xs text-celestial-400 font-semibold mb-1">MEANING</p>
                              <p className="text-sm text-cosmic-300">{card.overallMeaning}</p>
                            </div>
                          )}

                          <div>
                            <p className="text-xs text-celestial-400 font-semibold mb-1">
                              {card.isReversed ? 'REVERSED' : 'UPRIGHT'}
                            </p>
                            <p className="text-sm text-cosmic-300">
                              {card.isReversed ? card.reversedInterpretation : card.uprightInterpretation}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {!cards || cards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-cosmic-400 text-lg mb-4">This deck doesn't have any cards yet.</p>
            <Link href={`/card-creator/${deckId}`}>
              <Button className="bg-gradient-to-r from-celestial-600 to-mystic-600 hover:from-celestial-500 hover:to-mystic-500" data-testid="button-add-cards">
                Add Cards to Begin
              </Button>
            </Link>
          </div>
        ) : !spreads || spreads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-cosmic-400 text-lg mb-4">Create a spread to start doing readings.</p>
            <Link href={`/spread-creator/${deckId}`}>
              <Button className="bg-gradient-to-r from-celestial-600 to-mystic-600 hover:from-celestial-500 hover:to-mystic-500" data-testid="button-create-spread">
                Create Your First Spread
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}