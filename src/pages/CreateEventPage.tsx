import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventForm, { EventFormData } from "@/components/EventForm";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { eventsApi } from "@/lib/api";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: EventFormData) => {
    setIsLoading(true);
    try {
      const response = await eventsApi.create(formData);
      
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Your event has been created successfully.",
        });
        navigate("/events");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create an Event
            </span>
          </h1>
          <p className="text-muted-foreground">
            Share your event with the community
          </p>
        </div>

        <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default CreateEventPage;
