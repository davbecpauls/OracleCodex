import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import FileUpload from "@/components/ui/file-upload";
import { Plus, Check, Upload } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { insertCardSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { InsertCard, Deck } from "@shared/schema";

const formSchema = insertCardSchema.extend({
  frontImageUrl: insertCardSchema.shape.frontImageUrl.optional(),
});

export default function CardCreator() {
  const params = useParams();
  const deckId = params.deckId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>("");

  const form = useForm<InsertCard>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: 1,
      name: "",
      frontImageUrl: "",
      overallMeaning: "",
      uprightInterpretation: "",
      reversedInterpretation: "",
      historyLore: "",
      symbolism: "",
      notes: "",
    },
  });

  // Get deck info
  const { data: deck } = useQuery<Deck>({
    queryKey: ["/api/decks", deckId],
    enabled: !!deckId,
  });

  // Get existing cards to determine next card number
  const { data: cards } = useQuery({
    queryKey: ["/api/decks", deckId, "cards"],
    enabled: !!deckId,
  });

  useEffect(() => {
    if (cards && Array.isArray(cards) && cards.length > 0) {
      const maxCardNumber = Math.max(...cards.map((card: any) => card.cardNumber));
      form.setValue("cardNumber", maxCardNumber + 1);
    }
  }, [cards, form]);

  const createCard = useMutation({
    mutationFn: async (data: InsertCard) => {
      const response = await apiRequest("POST", `/api/decks/${deckId}/cards`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decks", deckId, "cards"] });
      toast({
        title: "Card Created",
        description: "Your mystical card has been added to the deck!",
      });
      form.reset({
        cardNumber: form.getValues("cardNumber") + 1,
        name: "",
        frontImageUrl: "",
        overallMeaning: "",
        uprightInterpretation: "",
        reversedInterpretation: "",
        historyLore: "",
        symbolism: "",
        notes: "",
      });
      setPreviewImage("");
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
        description: "Failed to create card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCard) => {
    createCard.mutate(data);
  };

  const handleAddAnother = () => {
    createCard.mutate(form.getValues());
  };

  const handleFinishDeck = () => {
    if (form.formState.isDirty) {
      createCard.mutate(form.getValues(), {
        onSuccess: () => {
          setLocation(`/deck-preview/${deckId}`);
        }
      });
    } else {
      setLocation(`/deck-preview/${deckId}`);
    }
  };

  const handleFileUpload = (url: string) => {
    form.setValue("frontImageUrl", url);
    setPreviewImage(url);
  };

  if (!deckId) {
    return <div>Deck ID required</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Card Creator
          </h1>
          <p className="text-cosmic-300 text-lg">Craft each card with intention and wisdom</p>
          {deck && (
            <p className="text-cosmic-400 text-sm mt-2">
              Creating cards for: <span className="text-celestial-400">{deck.name}</span>
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card Preview */}
          <div className="lg:col-span-1">
            <Card className="card-glow rounded-xl sticky top-24 border-mystic-600/20">
              <CardContent className="p-6">
                <h3 className="mystical-font text-lg font-semibold mb-4 text-celestial-300 text-center">
                  Card Preview
                </h3>
                <div className="aspect-[3/4] bg-cosmic-800 rounded-lg border-2 border-dashed border-mystic-600 flex items-center justify-center mb-4">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Card preview"
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  ) : (
                    <span className="text-cosmic-400 text-center">
                      Upload front design<br />to see preview
                    </span>
                  )}
                </div>
                <p className="text-cosmic-400 text-sm text-center">
                  Card #{form.watch("cardNumber")}: {form.watch("name") || "Unnamed Card"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Card Details Form */}
          <div className="lg:col-span-2">
            <Card className="card-glow rounded-xl border-mystic-600/20">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Card Front Design */}
                    <FormField
                      control={form.control}
                      name="frontImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-celestial-300 font-semibold">
                            <Upload className="w-4 h-4 inline mr-2" />
                            Card Front Design
                          </FormLabel>
                          <FormControl>
                            <FileUpload
                              onUpload={handleFileUpload}
                              accept="image/*"
                              className="border-2 border-dashed border-mystic-600 hover:border-celestial-500 rounded-xl p-6 text-center cursor-pointer transition-colors group"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Card Number */}
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-celestial-300 font-semibold">Card Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="bg-cosmic-800/50 border-mystic-700 text-white focus:ring-2 focus:ring-celestial-500 focus:border-transparent"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Card Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-celestial-300 font-semibold">Card Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="The Star"
                                className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Overall Meaning */}
                    <FormField
                      control={form.control}
                      name="overallMeaning"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-celestial-300 font-semibold">Overall Meaning / Energy</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ""}
                              rows={3}
                              placeholder="The essence and energy this card represents..."
                              className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Upright Interpretation */}
                      <FormField
                        control={form.control}
                        name="uprightInterpretation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-celestial-300 font-semibold">Upright Interpretation</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field}
                                value={field.value || ""}
                                rows={4}
                                placeholder="Meaning when drawn upright..."
                                className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Reversed Interpretation */}
                      <FormField
                        control={form.control}
                        name="reversedInterpretation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-celestial-300 font-semibold">Reversed Interpretation</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field}
                                value={field.value || ""}
                                rows={4}
                                placeholder="Meaning when drawn reversed..."
                                className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* History / Lore */}
                    <FormField
                      control={form.control}
                      name="historyLore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-celestial-300 font-semibold">History / Lore</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ""}
                              rows={3}
                              placeholder="Historical context and mystical lore..."
                              className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Symbolism */}
                    <FormField
                      control={form.control}
                      name="symbolism"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-celestial-300 font-semibold">Symbolism & Significance</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ""}
                              rows={3}
                              placeholder="Symbolic elements and their meanings..."
                              className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-celestial-300 font-semibold">Personal Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ""}
                              rows={2}
                              placeholder="Any additional insights or personal connections..."
                              className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button 
                        type="button"
                        onClick={handleAddAnother}
                        disabled={createCard.isPending}
                        className="flex-1 bg-gradient-to-r from-celestial-600 to-celestial-500 hover:from-celestial-500 hover:to-celestial-400 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-celestial-500/25 border-0"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Card
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleFinishDeck}
                        disabled={createCard.isPending}
                        className="flex-1 mystic-gradient hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-mystic-500/25 border-0"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Finish Deck
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
