import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // ✅ import toast hook

interface EventFormProps {
  onSubmit: (formData: EventFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
}

const EventForm = ({ onSubmit, isLoading = false }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: 10,
    currentParticipants: 0,
  });

  const { toast } = useToast(); // ✅ initialize toast

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final safety check before submit
    if (formData.currentParticipants > formData.maxParticipants) {
      toast({
        variant: "destructive",
        title: "Invalid participant count",
        description: "Current participants cannot exceed the maximum limit.",
      });
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "maxParticipants" || name === "currentParticipants"
        ? parseInt(value) || 0
        : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: parsedValue };

      // 🚨 Instant validation (live check)
      if (
        name === "currentParticipants" &&
        updated.currentParticipants > updated.maxParticipants
      ) {
        toast({
          variant: "destructive",
          title: "Invalid input",
          description:
            "Current participants cannot be greater than maximum participants.",
        });
      }

      return updated;
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[var(--gradient-card)] shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Create New Event
        </CardTitle>
        <CardDescription>
          Fill in the details to create an amazing event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location (e.g., New York, NY)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Maximum Participants *</Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentParticipants">Current Participants *</Label>
            <Input
              id="currentParticipants"
              name="currentParticipants"
              type="number"
              min="0"
              value={formData.currentParticipants}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
