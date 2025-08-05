import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-md w-full">
        <Card className="card-glow rounded-2xl border-mystic-600/20 animate-float celestial-glow">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mb-6">
                <Moon className="w-16 h-16 mx-auto text-celestial-400 mb-4 animate-glow" />
              </div>
              <h1 className="mystical-font text-3xl font-bold mb-2 bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
                Enter the Realm
              </h1>
              <p className="text-cosmic-300 font-light">
                Design, organize, and publish your own tarot & oracle decks
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="w-full mystic-gradient hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-mystic-500/25 hover:scale-105 border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sign In with Magic
              </Button>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-cosmic-700"></div>
                <span className="px-4 text-cosmic-400 text-sm">or continue with</span>
                <div className="flex-1 border-t border-cosmic-700"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  className="py-3 px-4 border-cosmic-600 hover:border-mystic-500 text-cosmic-300 hover:text-white hover:bg-mystic-800/30"
                >
                  <i className="fab fa-google mr-2 text-celestial-400"></i>
                  Google
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  className="py-3 px-4 border-cosmic-600 hover:border-mystic-500 text-cosmic-300 hover:text-white hover:bg-mystic-800/30"
                >
                  <i className="fab fa-facebook mr-2 text-celestial-400"></i>
                  Facebook
                </Button>
              </div>

              <p className="text-center text-cosmic-400 text-sm mt-6">
                New to Obscura Codex?{" "}
                <button 
                  onClick={() => window.location.href = "/api/login"}
                  className="text-celestial-400 hover:text-celestial-300 underline transition-colors"
                >
                  Create your account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
