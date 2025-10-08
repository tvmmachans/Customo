import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, MessageCircle, Phone, Info } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be connected to Supabase later
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CR</span>
            </div>
            <span className="text-xl font-bold text-primary">Customo RoBo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/" ? "text-primary" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/shop" ? "text-primary" : ""
              }`}
            >
              Shop
            </Link>
            <Link
              to="/custom-build"
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/custom-build" ? "text-primary" : ""
              }`}
            >
              Custom Build
            </Link>
            <Link
              to="/service"
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === "/service" ? "text-primary" : ""
              }`}
            >
              Service
            </Link>
            {isLoggedIn && (
              <Link
                to="/your-devices"
                className={`text-foreground hover:text-primary transition-colors ${
                  location.pathname === "/your-devices" ? "text-primary" : ""
                }`}
              >
                Your Devices
              </Link>
            )}
          </div>

          {/* Right side - Login & Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                variant="outline"
                onClick={() => logout()}
                className="hidden sm:flex"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="cta"
                onClick={() => (window.location.href = "/login")}
                className="hidden sm:flex"
              >
                Login
              </Button>
            )}

            {/* 3-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Customer Service Chat
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