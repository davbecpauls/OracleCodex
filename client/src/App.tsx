import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Vault from "@/pages/vault";
import Altar from "@/pages/altar";
import CardCreator from "@/pages/card-creator";
import DeckPreview from "@/pages/deck-preview";
import SpreadCreator from "@/pages/spread-creator";
import Profile from "@/pages/profile";
import Reading from "@/pages/reading";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import MobileMenu from "@/components/mobile-menu";
import StarsBackground from "@/components/ui/stars-background";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen relative">
      <StarsBackground />
      
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <MobileMenu />}
      
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/vault" component={Vault} />
            <Route path="/altar" component={Altar} />
            <Route path="/card-creator/:deckId?" component={CardCreator} />
            <Route path="/deck-preview/:deckId" component={DeckPreview} />
            <Route path="/spread-creator/:deckId" component={SpreadCreator} />
            <Route path="/reading/:deckId" component={Reading} />
            <Route path="/profile" component={Profile} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
