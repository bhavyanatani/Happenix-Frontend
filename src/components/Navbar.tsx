import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const initializedRef = useRef(false);
  
  // Hide Explore button on Events page
  const isEventsPage = location.pathname === "/events" || location.pathname === "/";
  // Hide search bar on CreateEvent page
  const isCreateEventPage = location.pathname === "/create-event";

  // Initialize search query from URL params on mount
  useEffect(() => {
    if (isEventsPage && !initializedRef.current) {
      const params = new URLSearchParams(location.search);
      const queryParam = params.get("q");
      if (queryParam) {
        setSearchQuery(queryParam);
      }
      initializedRef.current = true;
    }
  }, [location.pathname, isEventsPage]); // Only check pathname, not search to avoid loops

  // Debounce search query to avoid too many API calls (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Trigger search when debounced query changes (only on Events page and after initialization)
  useEffect(() => {
    if (onSearch && isEventsPage && initializedRef.current) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch, isEventsPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Mark as initialized when user starts typing
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Happenix
            </span>
          </Link>

          {/* Search Bar - Hidden on CreateEvent page */}
          {!isCreateEventPage && (
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {!isEventsPage && (
              <Button
                variant="ghost"
                onClick={() => navigate("/events")}
                className="hidden sm:inline-flex"
              >
                Explore
              </Button>
            )}
            <Button
              variant="default"
              onClick={() => navigate("/create-event")}
            >
              Create Event
            </Button>
          </div>
        </div>

        {/* Mobile Search - Hidden on CreateEvent page */}
        {!isCreateEventPage && (
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
