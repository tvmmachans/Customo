import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import MiniCart from "@/components/MiniCart";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, MessageCircle, Phone, Info, ShoppingCart } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { items } = useCart();
  const { user, logout } = useAuth();
  const cartCount = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const [miniOpen, setMiniOpen] = useState(false);
  const { lastUpdated } = useCart();
  const [pulsing, setPulsing] = useState(false);

  // Trigger pulse animation when cart updates
  useEffect(() => {
    if (!lastUpdated) return;
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), 600);
    return () => clearTimeout(t);
  }, [lastUpdated]);


  return (
    <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-xl shadow-sm border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo (uses public/images/logo.png) */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/images/logo.png"
              alt="Customo Robos logo"
              className="w-10 h-10 rounded-lg object-cover shadow-lg"
              onError={(e) => {
                // If the image is missing fallback to the original inline badge
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const container = target.parentElement;
                if (!container) return;
                const badge = document.createElement("div");
                badge.className = "w-10 h-10 bg-gradient-to-br from-primary via-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20";
                badge.innerHTML = '<span class="text-primary-foreground font-bold text-lg">CR</span>';
                container.insertBefore(badge, target);
              }}
            />
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Customo RoBo</span>
              <p className="text-[10px] text-muted-foreground -mt-1 tracking-wider">ADVANCED ROBOTICS</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group ${
                location.pathname === "/" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              Home
              {location.pathname === "/" && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link
              to="/shop"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                location.pathname === "/shop" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              Shop
              {location.pathname === "/shop" && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link
              to="/custom-build"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                location.pathname === "/custom-build" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              Custom Build
              {location.pathname === "/custom-build" && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link
              to="/service"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                location.pathname === "/service" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              Service
              {location.pathname === "/service" && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            {user && (
              <Link
                to="/your-devices"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                  location.pathname === "/your-devices"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                Your Devices
                {location.pathname === "/your-devices" && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button 
              onClick={() => setMiniOpen(true)} 
              className="hidden sm:flex relative"
            >
              <div className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 group">
                <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="hidden lg:block font-medium text-muted-foreground group-hover:text-primary transition-colors">Cart</span>
                {cartCount > 0 && (
                  <span aria-label={`${cartCount} items in cart`} className={`absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-primary-foreground shadow-lg ${pulsing ? 'badge-pulse' : ''}`}>
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
            {miniOpen && <MiniCart onClose={() => setMiniOpen(false)} />}
            
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  className="border-border/50 hover:bg-accent/50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = "/signup")}
                  className="hover:bg-accent/50"
                >
                  Sign Up
                </Button>
                <Button
                  variant="default"
                  onClick={() => (window.location.href = "/login")}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/20"
                >
                  Login
                </Button>
              </div>
            )}

            {/* More menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-accent/50">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 mt-2">
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center w-full cursor-pointer">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center w-full cursor-pointer">
                    <Info className="mr-2 h-4 w-4" />
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;