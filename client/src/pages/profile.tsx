import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Star, Plus, Wand2, BookOpen } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Deck, User } from "@shared/schema";

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: decks, error } = useQuery<Deck[]>({
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

  const publishedDecks = decks?.filter(deck => deck.isPublished) || [];
  const totalDecks = decks?.length || 0;

  const activities = [
    {
      icon: Star,
      text: "Published \"Lunar Wisdom\" deck",
      time: "2 hours ago",
      color: "text-celestial-400"
    },
    {
      icon: Plus,
      text: "Added 3 new cards to \"Crystal Guidance\"",
      time: "1 day ago",
      color: "text-mystic-400"
    },
    {
      icon: Wand2,
      text: "Created new spread \"Cosmic Trinity\"",
      time: "3 days ago",
      color: "text-celestial-400"
    },
    {
      icon: BookOpen,
      text: "Generated guidebook for \"Elemental Forces\"",
      time: "1 week ago",
      color: "text-mystic-400"
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 pt-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mystical-font text-4xl font-bold mb-4 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
            Mystic Profile
          </h1>
          <p className="text-cosmic-300 text-lg">Your magical journey and creations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <Card className="card-glow rounded-xl border-mystic-600/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-celestial-400 shadow-lg object-cover" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-celestial-400 shadow-lg bg-cosmic-800 flex items-center justify-center">
                    <span className="text-celestial-400 text-2xl">
                      {user?.firstName?.[0] || user?.email?.[0] || "?"}
                    </span>
                  </div>
                )}
                <h2 className="mystical-font text-xl font-semibold text-celestial-300">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || "Mystical User"
                  }
                </h2>
                <p className="text-cosmic-400">Cosmic Oracle Creator</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-cosmic-400">Decks Created:</span>
                  <span className="text-white">{totalDecks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-400">Published:</span>
                  <span className="text-celestial-400">{publishedDecks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-400">Joined:</span>
                  <span className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-400">Readings Given:</span>
                  <span className="text-white">247</span>
                </div>
              </div>

              <Separator className="my-6 bg-cosmic-700" />

              <Button className="w-full mystic-gradient hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-mystic-500/25 border-0">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="card-glow rounded-xl border-mystic-600/20">
              <CardContent className="p-8">
                <h3 className="mystical-font text-xl font-semibold mb-6 text-celestial-300">
                  Recent Activity
                </h3>
                
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-cosmic-800/30 rounded-lg">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-white">{activity.text}</p>
                        <p className="text-cosmic-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Decks */}
                {decks && decks.length > 0 && (
                  <>
                    <Separator className="my-6 bg-cosmic-700" />
                    <h4 className="mystical-font text-lg font-semibold mb-4 text-celestial-300">
                      Recent Decks
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {decks.slice(0, 4).map((deck) => (
                        <div key={deck.id} className="p-4 bg-cosmic-800/30 rounded-lg">
                          <h5 className="text-white font-medium">{deck.name}</h5>
                          <p className="text-cosmic-400 text-sm mt-1 line-clamp-2">
                            {deck.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              deck.isPublished 
                                ? "bg-celestial-500/20 text-celestial-400" 
                                : "bg-mystic-500/20 text-mystic-400"
                            }`}>
                              {deck.isPublished ? "Published" : "Draft"}
                            </span>
                            <span className="text-cosmic-500 text-xs">
                              {deck.createdAt ? new Date(deck.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
