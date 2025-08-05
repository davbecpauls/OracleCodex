import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Archive, Wand2, User, Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/vault", label: "Vault", icon: Archive },
    { href: "/altar", label: "Altar", icon: Wand2 },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-900/80 backdrop-blur-lg border-b border-mystic-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Moon className="w-8 h-8 text-celestial-400" />
              <span className="mystical-font text-xl font-semibold bg-gradient-to-r from-celestial-400 to-mystic-400 bg-clip-text text-transparent">
                Obscura Codex
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`text-cosmic-300 hover:text-celestial-400 transition-colors ${
                      isActive ? "text-celestial-400" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-celestial-400 hover:text-celestial-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-mystic-800/30 bg-cosmic-900/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-cosmic-300 hover:text-celestial-400 hover:bg-mystic-800/30 ${
                      isActive ? "text-celestial-400 bg-mystic-800/20" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-mystic-800/30 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-800/20"
                onClick={() => window.location.href = "/api/logout"}
              >
                <i className="fas fa-sign-out-alt mr-3"></i>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
