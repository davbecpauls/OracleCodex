import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import FileUpload from "@/components/ui/file-upload";
import { ArrowLeft, Wand2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { insertDeckSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { InsertDeck } from "@shared/schema";

const formSchema = insertDeckSchema.extend({
  cardBackImageUrl: insertDeckSchema.shape.cardBackImageUrl.optional(),
  thumbnailUrl: insertDeckSchema.shape.thumbnailUrl.optional(),
});

export default function Altar() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDeck>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      cardBackImageUrl: "",
      thumbnailUrl: "",
    },
  });

  const createDeck = useMutation({
    mutationFn: async (data: InsertDeck) => {
      const response = await apiRequest("POST", "/api/decks", data);
      return response.json();
    },
    onSuccess: (deck) => {
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({
        title: "Deck Created",
        description: "Your mystical deck has been born! Start adding cards.",
      });
      setLocation(`/card-creator/${deck.id}`);
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
        description: "Failed to create deck. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDeck) => {
    createDeck.mutate(data);
  };

  const handleFileUpload = (url: string, field: "cardBackImageUrl" | "thumbnailUrl") => {
    form.setValue(field, url);
  };

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Sacred Altar
          </h1>
          <p className="text-cosmic-300 text-lg">Where mystical decks are born</p>
        </div>

        <Card className="card-glow rounded-2xl border-mystic-600/20">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Card Back Design Upload */}
                <FormField
                  control={form.control}
                  name="cardBackImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-celestial-300 font-semibold">
                        <i className="fas fa-images mr-2"></i>
                        Card Back Design
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={(url) => handleFileUpload(url, "cardBackImageUrl")}
                          accept="image/*"
                          className="border-2 border-dashed border-mystic-600 hover:border-celestial-500 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Deck Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-celestial-300 font-semibold">
                        <i className="fas fa-signature mr-2"></i>
                        Deck Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Enter your deck's mystical name..."
                          className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-celestial-300 font-semibold">
                        <i className="fas fa-scroll mr-2"></i>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          rows={4}
                          placeholder="Describe the essence and purpose of your deck..."
                          className="bg-cosmic-800/50 border-mystic-700 text-white placeholder-cosmic-400 focus:ring-2 focus:ring-celestial-500 focus:border-transparent resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Deck Thumbnail */}
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-celestial-300 font-semibold">
                        <i className="fas fa-image mr-2"></i>
                        Deck Thumbnail (Optional)
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={(url) => handleFileUpload(url, "thumbnailUrl")}
                          accept="image/*"
                          className="border-2 border-dashed border-mystic-600 hover:border-celestial-500 rounded-xl p-6 text-center cursor-pointer transition-colors group"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Link href="/vault" className="flex-1">
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full bg-cosmic-700 hover:bg-cosmic-600 text-white border-cosmic-600"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Vault
                    </Button>
                  </Link>
                  <Button 
                    type="submit"
                    disabled={createDeck.isPending}
                    className="flex-1 mystic-gradient hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-mystic-500/25 border-0"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {createDeck.isPending ? "Creating..." : "Start Creating Cards"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
