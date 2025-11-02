import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import { Loader2, Calendar, Sparkles, TrendingUp, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { eventsApi } from "@/lib/api";
import { getCurrentLocation } from "@/hooks/useGeolocation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Event {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  distance?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Initialize userCoords from localStorage synchronously to prevent race condition
  const getInitialUserCoords = (): { latitude: number; longitude: number } | null => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        if (location.latitude && location.longitude) {
          console.log('Initialized userCoords from localStorage:', location);
          return location;
        }
      }
    } catch (e) {
      // Invalid saved location
      localStorage.removeItem('userLocation');
    }
    return null;
  };
  
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(getInitialUserCoords);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [requestingLocation, setRequestingLocation] = useState(false);

  const searchQuery = searchParams.get("q") || "";

  const requestLocation = async () => {
    setRequestingLocation(true);
    setLocationError(null);
    try {
      const coords = await getCurrentLocation();
      const locationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      setUserCoords(locationData);
      // Save to localStorage for future use
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      toast({
        title: "Location enabled",
        description: "Events are now sorted by distance from you.",
      });
      // Refresh events with location - userCoords will trigger useEffect
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get location";
      setLocationError(errorMessage);
      toast({
        variant: "destructive",
        title: "Location Error",
        description: errorMessage,
      });
    } finally {
      setRequestingLocation(false);
    }
  };

  const fetchEvents = async (query?: string) => {
    setLoading(true);
    try {
      const params: { search?: string; latitude?: number; longitude?: number } = {};
      
      if (query) {
        params.search = query;
      }
      
      // Always use current userCoords state if available
      if (userCoords?.latitude && userCoords?.longitude) {
        params.latitude = userCoords.latitude;
        params.longitude = userCoords.longitude;
        console.log('✅ Fetching events WITH user coordinates:', params);
      } else {
        console.log('⚠️ Fetching events WITHOUT user coordinates. userCoords:', userCoords);
      }
      
      const response = await eventsApi.getAll(Object.keys(params).length > 0 ? params : undefined);
      console.log('📦 Received events:', response.data);
      if (response.data && response.data.length > 0) {
        console.log('📊 Sample event:', {
          title: response.data[0].title,
          distance: response.data[0].distance,
          hasCoordinates: !!(response.data[0].latitude && response.data[0].longitude)
        });
      }
      setEvents(response.data);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when search query or user coordinates change
  useEffect(() => {
    fetchEvents(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, userCoords]);

  const handleSearch = (query: string) => {
    // Update URL params to reflect the search query
    const trimmedQuery = query.trim();
    const currentQuery = searchParams.get("q") || "";
    
    // Only update if the query actually changed to prevent loops
    if (trimmedQuery !== currentQuery) {
      if (trimmedQuery) {
        setSearchParams({ q: trimmedQuery });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />

      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Discover Events
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Browse all available events sorted by distance"}
          </p>

          {/* Location Request */}
          {!userCoords && (
            <Alert className="mt-6 max-w-2xl">
              <MapPin className="h-4 w-4" />
              <AlertTitle>Enable Location</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>
                  Allow location access to see distances and get events sorted by proximity.
                </span>
                <Button
                  onClick={requestLocation}
                  disabled={requestingLocation}
                  size="sm"
                >
                  {requestingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Enable Location
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Location Error */}
          {locationError && (
            <Alert variant="destructive" className="mt-4 max-w-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          {!loading && events.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{events.length} events found</span>
              </div>
              {events.some(e => e.distance !== null) && (
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Sorted by distance</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading amazing events...</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-primary/10 rounded-full">
                <Calendar className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">No Events Found</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or browse all events."
                : "No events available at the moment. Be the first to create one!"}
            </p>
            {searchQuery ? (
              <Button
                variant="default"
                onClick={() => setSearchParams({})}
              >
                View All Events
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={() => window.location.href = "/create-event"}
              >
                Create First Event
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;
