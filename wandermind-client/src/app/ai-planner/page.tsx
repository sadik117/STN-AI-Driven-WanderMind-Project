"use client"
import { useState } from "react";
import { aiService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Map, Compass, Clock, DollarSign, Lightbulb, Calendar, Package, Languages, Sun, Moon, Utensils, Landmark, ShoppingBag, Mountain, TreePine } from "lucide-react";
import { toast } from "sonner";

interface ItineraryActivity {
  time: string;
  place: string;
  description: string;
  duration: string;
  estimatedCost: number;
  tip: string;
  category: string;
}

interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

interface ItineraryData {
  title: string;
  summary: string;
  totalEstimatedCost: number;
  currency: string;
  days: ItineraryDay[];
  packingTips: string[];
  bestTimeToVisit: string;
  localPhrases: Array<{ phrase: string; meaning: string }>;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'food': return Utensils;
    case 'culture': return Landmark;
    case 'shopping': return ShoppingBag;
    case 'adventure': return Mountain;
    case 'nature': return TreePine;
    default: return Map;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'food': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/30';
    case 'culture': return 'text-purple-500 bg-purple-50 dark:bg-purple-950/30';
    case 'shopping': return 'text-pink-500 bg-pink-50 dark:bg-pink-950/30';
    case 'adventure': return 'text-red-500 bg-red-50 dark:bg-red-950/30';
    case 'nature': return 'text-green-500 bg-green-50 dark:bg-green-950/30';
    default: return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30';
  }
};

export default function AIPlannerPage() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);

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
      <div className="container mx-auto px-4 py-16 max-w-6xl">
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
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border rounded-3xl p-6 md:p-8">
                  <h2 className="text-3xl font-bold mb-3 font-heading">{itinerary.title}</h2>
                  <p className="text-muted-foreground text-lg mb-4">{itinerary.summary}</p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <DollarSign className="h-5 w-5" />
                    <span>Estimated Total: {itinerary.currency} {itinerary.totalEstimatedCost}</span>
                  </div>
                </div>

                {/* Days */}
                {itinerary.days?.map((day) => (
                  <div key={day.day} className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-primary/5 px-6 py-4 border-b">
                      <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                        <Sun className="h-6 w-6 text-primary" />
                        Day {day.day}: {day.theme}
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {day.activities?.map((activity, idx) => {
                        const Icon = getCategoryIcon(activity.category);
                        const colorClass = getCategoryColor(activity.category);
                        return (
                          <div key={idx} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                            <div className="flex-shrink-0 w-16 text-right">
                              <span className="font-mono text-sm font-semibold text-primary">{activity.time}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-bold text-lg">{activity.place}</h4>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                                  <Icon className="h-3 w-3" />
                                  {activity.category}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">{activity.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {activity.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {itinerary.currency} {activity.estimatedCost}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Lightbulb className="h-3 w-3 text-yellow-500" />
                                  {activity.tip}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Packing Tips */}
                {itinerary.packingTips && itinerary.packingTips.length > 0 && (
                  <div className="bg-card border rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" /> Packing Tips
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {itinerary.packingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-primary">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Best Time & Local Phrases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itinerary.bestTimeToVisit && (
                    <div className="bg-card border rounded-3xl p-6">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" /> Best Time to Visit
                      </h3>
                      <p className="text-muted-foreground">{itinerary.bestTimeToVisit}</p>
                    </div>
                  )}
                  
                  {itinerary.localPhrases && itinerary.localPhrases.length > 0 && (
                    <div className="bg-card border rounded-3xl p-6">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Languages className="h-5 w-5 text-primary" /> Local Phrases
                      </h3>
                      <div className="space-y-2">
                        {itinerary.localPhrases.map((phrase, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                            <span className="font-medium">{phrase.phrase}</span>
                            <span className="text-muted-foreground text-sm">{phrase.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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