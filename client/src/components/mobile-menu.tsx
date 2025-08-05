import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Archive, Wand2, User, History, Settings, HelpCircle, LogOut } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const mainItems = [
    { href: "/vault", label: "My Vault", icon: Archive },
    { href: "/altar", label: "Altar", icon: Wand2 },
    { href: "/profile", label: "My Profile", icon: User },
  ];

  const secondaryItems = [
    { href: "/orders", label: "Order History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Contact", icon: HelpCircle },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 lg:hidden text-celestial-400 hover:text-celestial-300 bg-cosmic-900/80 backdrop-blur-lg border border-mystic-800/30"
        >
          <i className="fas fa-bars text-xl"></i>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-80 bg-cosmic-800/95 backdrop-blur-xl border-l border-mystic-800/30 text-white"
      >
        <SheetHeader>
          <SheetTitle className="mystical-font text-lg font-semibold text-celestial-400">
            Menu
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-4">
          {/* Main Navigation */}
          {mainItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 bg-mystic-800/30 hover:bg-mystic-700/40 text-cosmic-200 hover:text-celestial-400 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          <Separator className="bg-mystic-800/50" />
          
          {/* Secondary Navigation */}
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 bg-mystic-800/30 hover:bg-mystic-700/40 text-cosmic-200 hover:text-celestial-400 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          <Separator className="bg-mystic-800/50" />
          
          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 bg-red-800/30 hover:bg-red-700/40 text-red-300 hover:text-red-200 transition-all"
            onClick={() => window.location.href = "/api/logout"}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
