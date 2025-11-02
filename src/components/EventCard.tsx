import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    location?: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/events/${event._id}`)}
      className="cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 bg-[var(--gradient-card)]"
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary hover:text-accent transition-colors">
          {event.title}
        </CardTitle>
        <CardDescription className="mt-2">
          {event.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default EventCard;
