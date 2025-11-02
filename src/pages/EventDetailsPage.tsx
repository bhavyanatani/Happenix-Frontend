import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, ArrowLeft, Loader2, MapPinned } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { eventsApi } from "@/lib/api";
import { getCurrentLocation } from "@/hooks/useGeolocation";

interface EventDetails {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  distance?: number | null;
}

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Try to load saved location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserCoords(location);
      } catch (e) {
        // Invalid saved location
        localStorage.removeItem('userLocation');
      }
    }

    // Try to get current location if not saved
    if (!savedLocation) {
      getCurrentLocation()
        .then((coords) => {
          setUserCoords({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          localStorage.setItem('userLocation', JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }));
        })
        .catch(() => {
          // User denied or error getting location - that's okay
        });
    }
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const params = userCoords ? {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
        } : undefined;
        
        const response = await eventsApi.getById(id, params);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, userCoords, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Button onClick={() => navigate("/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/events")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        {/* Event Details Card */}
        <Card className="max-w-4xl mx-auto bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Event</h3>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {event.currentParticipants} / {event.maxParticipants} registered
                    </p>
                    <div className="mt-2 w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(event.currentParticipants / event.maxParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {event.distance !== null && event.distance !== undefined && (
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                    <MapPinned className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Distance</p>
                      <p className="text-sm text-muted-foreground">
                        {event.distance.toFixed(1)} km away from you
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EventDetailsPage;
