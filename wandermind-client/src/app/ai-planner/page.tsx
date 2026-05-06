"use client"
import { useState } from "react";
import { aiService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Map, Compass } from "lucide-react";
import { toast } from "sonner";

export default function AIPlannerPage() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await aiService.generateItinerary({ 
        destination, 
        days, 
        travelStyle: "Balanced",
        interests: ["culture", "food", "sightseeing"] 
      });
      setItinerary(result.data || result);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to generate itinerary. Make sure you are logged in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">AI Travel Planner</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let our advanced AI build the perfect, personalized itinerary for your next trip in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold mb-6 font-heading flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" /> Trip Details
              </h2>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="destination" className="text-base">Where do you want to go?</Label>
                  <Input 
                    id="destination" 
                    placeholder="e.g., Tokyo, Paris, Bali" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)} 
                    className="h-12 text-lg"
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="days" className="text-base">Duration (Days)</Label>
                  <Input 
                    id="days" 
                    type="number" 
                    min="1" 
                    max="14" 
                    value={days} 
                    onChange={(e) => setDays(parseInt(e.target.value))} 
                    className="h-12 text-lg"
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full h-14 text-lg mt-4 rounded-xl" disabled={loading || !destination}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Generating Magic...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate Itinerary <Sparkles className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            {loading ? (
              <div className="bg-card border rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                  <Compass className="h-16 w-16 text-primary animate-spin-slow relative z-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2 font-heading">Crafting Your Journey</h3>
                <p className="text-muted-foreground">Analyzing top attractions, local secrets, and optimal routes...</p>
              </div>
            ) : itinerary ? (
              <div className="bg-card border rounded-3xl p-6 md:p-10 shadow-sm">
                <h2 className="text-3xl font-bold mb-8 font-heading flex items-center gap-3">
                  <Map className="h-8 w-8 text-primary" /> Your Custom Itinerary
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  {/* Note: In a real app you'd use a markdown renderer here */}
                  <div className="bg-muted/50 p-6 rounded-2xl whitespace-pre-wrap font-sans text-base leading-relaxed border">
                    {typeof itinerary.itinerary === 'string' ? itinerary.itinerary : 
                     typeof itinerary === 'string' ? itinerary : 
                     JSON.stringify(itinerary, null, 2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card/50 border border-dashed rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px] text-center opacity-70">
                <Map className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-muted-foreground font-heading">Awaiting Destination</h3>
                <p className="text-muted-foreground max-w-md">Fill out the details on the left to instantly generate a day-by-day travel plan curated by AI.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
