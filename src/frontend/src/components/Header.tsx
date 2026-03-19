import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Deals", href: "/" },
  { label: "Tech", href: "/?category=laptops" },
  { label: "Home & Kitchen", href: "/?category=kitchen" },
  { label: "Fashion", href: "/?category=fashion" },
  { label: "Fitness", href: "/?category=fitness" },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate({ to: "/", search: { q: searchQuery, category: undefined } });
    }
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      await login();
    }
  };

  const isActive = (href: string) =>
    location.pathname + location.search === href;

  return (
    <header className="bg-card shadow-xs sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-6 h-14">
          <a
            href="/"
            data-ocid="header.link"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                D
              </span>
            </div>
            <span className="font-bold text-lg text-foreground">
              DealFinder
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid="nav.link"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              data-ocid="header.search_input"
              className="hidden md:flex"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              data-ocid="header.toggle"
              onClick={handleAuth}
              disabled={isLoggingIn}
              title={isAuthenticated ? "Logout" : "Login"}
            >
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-4 h-4" />
            </Button>
            {isAuthenticated && (
              <a
                href="/admin"
                data-ocid="nav.link"
                className="ml-2 text-xs font-semibold text-primary hover:underline hidden md:block"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex gap-2">
            <Input
              data-ocid="search.input"
              placeholder="Search for Amazon deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              data-ocid="search.button"
              onClick={handleSearch}
              className="bg-hero-cta hover:bg-hero-cta/90 text-white px-6"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
