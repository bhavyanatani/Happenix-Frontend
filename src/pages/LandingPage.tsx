import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Sparkles, ArrowRight, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Icon */}
          <div className="flex justify-center animate-scale-in">
            <div className="relative p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full backdrop-blur-sm border border-primary/20 shadow-lg">
              <Calendar className="h-16 w-16 text-primary animate-float" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4 animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Happenix
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span>Join thousands discovering local events</span>
              <Star className="h-4 w-4 text-accent fill-accent" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Discover and create amazing local events. Connect with your community and make unforgettable memories.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/events")}
              className="text-lg group"
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/create-event")}
              className="text-lg border-2 hover:border-primary"
            >
              Create Event
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Events</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Members</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Cities</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="group space-y-3 p-8 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-hover)] animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Find Nearby Events</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover events happening in your area with intelligent distance-based search and sorting
              </p>
            </div>

            <div className="group space-y-3 p-8 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-hover)] animate-fade-in" style={{ animationDelay: "1s" }}>
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Connect & Participate</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join events and meet amazing people who share your interests and passions
              </p>
            </div>

            <div className="group space-y-3 p-8 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-hover)] animate-fade-in" style={{ animationDelay: "1.2s" }}>
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Create Your Own</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organize events effortlessly and bring your community together with powerful tools
              </p>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 animate-fade-in" style={{ animationDelay: "1.4s" }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join our community and start exploring events that matter to you
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/events")}
              className="text-lg"
            >
              Browse Events Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
