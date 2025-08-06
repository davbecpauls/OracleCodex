import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Check, Save } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { insertSpreadSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { InsertSpread, Deck } from "@shared/schema";

const formSchema = insertSpreadSchema.extend({
  positions: insertSpreadSchema.shape.positions,
});

export default function SpreadCreator() {
  const params = useParams();
  const deckId = params.deckId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [cardPositions, setCardPositions] = useState<Array<{ name: string; x: number; y: number }>>([
    { name: "Past", x: 0, y: 0 },
    { name: "Present", x: 1, y: 0 },
    { name: "Future", x: 2, y: 0 },
  ]);

  const form = useForm<InsertSpread>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Cosmic Trinity",
      description: "This spread reveals past, present, and future influences...",
      cardCount: 3,
      positions: cardPositions,
    },
  });

  // Get deck info
  const { data: deck } = useQuery<Deck>({
    queryKey: ["/api/decks", deckId],
    enabled: !!deckId,
  });

  const createSpread = useMutation({
    mutationFn: async (data: InsertSpread) => {
      const response = await apiRequest("POST", `/api/decks/${deckId}/spreads`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decks", deckId, "spreads"] });
      toast({
        title: "Spread Saved",
        description: "Your custom spread has been added to the deck!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save spread. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCardCountChange = (value: string) => {
    const count = parseInt(value);
    form.setValue("cardCount", count);
    
    // Update card positions based on count
    const newPositions = [];
    const positionNames = ["Past", "Present", "Future", "Foundation", "Challenge", "Guidance", "Outcome"];
    
    for (let i = 0; i < count; i++) {
      newPositions.push({
        name: positionNames[i] || `Position ${i + 1}`,
        x: i % 3,
        y: Math.floor(i / 3),
      });
    }
    
    setCardPositions(newPositions);
    form.setValue("positions", newPositions);
  };

  const updatePositionName = (index: number, name: string) => {
    const newPositions = [...cardPositions];
    newPositions[index].name = name;
    setCardPositions(newPositions);
    form.setValue("positions", newPositions);
  };

  const onSubmit = (data: InsertSpread) => {
    createSpread.mutate(data);
  };

  const handleComplete = () => {
    if (form.formState.isDirty) {
      createSpread.mutate(form.getValues(), {
        onSuccess: () => {
          setLocation("/vault");
        }
      });
    } else {
      setLocation("/vault");
    }
  };

  if (!deckId) {
    return <div>Deck ID required</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Spread Creator
          </h1>
          <p className="text-cosmic-300 text-lg">Design custom layouts for your readings</p>
          {deck && (
            <p className="text-cosmic-400 text-sm mt-2">
              Creating spreads for: <span className="text-celestial-400">{deck.name}</span>
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Spread Configuration */}
          <Card className="card-glow rounded-xl border-mystic-600/20">
            <CardContent className="p-8">
              <h3 className="mystical-font text-xl font-semibold mb-6 text-celestial-300">
                Spread Configuration
              </h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Spread Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-celestial-300 font-semibold">Spread Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of Cards */}
                  <FormField
                    control={form.control}
                    name="cardCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-celestial-300 font-semibold">Number of Cards</FormLabel>
                        <Select onValueChange={handleCardCountChange} defaultValue="3">
                          <FormControl>
                            <SelectTrigger className="bg-cosmic-800/50 border-mystic-700 text-white focus:ring-2 focus:ring-celestial-500 focus:border-transparent">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 Cards</SelectItem>
                            <SelectItem value="5">5 Cards</SelectItem>
                            <SelectItem value="7">7 Cards</SelectItem>
                            <SelectItem value="10">10 Cards</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Spread Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-celestial-300 font-semibold">Spread Purpose</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            value={field.value || ""}
                            rows={3}
                            className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Card Positions */}
                  <div>
                    <FormLabel className="text-celestial-300 font-semibold mb-3 block">Card Positions</FormLabel>
                    <div className="space-y-3">
                      {cardPositions.map((position, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-cosmic-400 w-8">{index + 1}.</span>
                          <Input 
                            value={position.name}
                            onChange={(e) => updatePositionName(index, e.target.value)}
                            className="flex-1 bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Spread Layout Preview */}
          <Card className="card-glow rounded-xl border-mystic-600/20">
            <CardContent className="p-8">
              <h3 className="mystical-font text-xl font-semibold mb-6 text-celestial-300">
                Layout Preview
              </h3>
              
              <div className="bg-cosmic-800/30 rounded-xl p-8 min-h-96 flex items-center justify-center">
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  {cardPositions.map((position, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-16 h-24 bg-mystic-700/50 border-2 border-dashed border-mystic-500 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-celestial-400 font-bold">{index + 1}</span>
                      </div>
                      <span className="text-cosmic-400 text-xs text-center max-w-20">
                        {position.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-cosmic-400 text-sm mb-4">Drag and drop to rearrange positions</p>
                <Button 
                  onClick={() => createSpread.mutate(form.getValues())}
                  disabled={createSpread.isPending}
                  className="bg-gradient-to-r from-celestial-600 to-celestial-500 hover:from-celestial-500 hover:to-celestial-400 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-celestial-500/25 border-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createSpread.isPending ? "Saving..." : "Save Spread"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href={`/deck-preview/${deckId}`} className="flex-1">
            <Button 
              variant="outline"
              className="w-full bg-cosmic-700 hover:bg-cosmic-600 text-white border-cosmic-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Preview
            </Button>
          </Link>
          <Button 
            onClick={handleComplete}
            disabled={createSpread.isPending}
            className="flex-1 mystic-gradient hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-mystic-500/25 border-0"
          >
            <Check className="w-4 h-4 mr-2" />
            Complete Deck
          </Button>
        </div>
      </div>
    </div>
  );
}
