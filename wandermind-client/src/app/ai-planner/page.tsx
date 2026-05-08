"use client"
import { useState, useRef } from "react";
import { aiService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Map, 
  Compass, 
  Clock, 
  DollarSign, 
  Lightbulb, 
  Calendar, 
  Package, 
  Languages, 
  Sun, 
  Utensils, 
  Landmark, 
  ShoppingBag, 
  Mountain, 
  TreePine,
  Globe,
  Shield,
  CheckCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


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
    case 'food': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'culture': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'shopping': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
    case 'adventure': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'nature': return 'text-green-500 bg-green-500/10 border-green-500/20';
    default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  }
};

export default function AIPlannerPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const itineraryRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to generate your travel itinerary!");
      router.push("/login?redirect=/ai-planner");
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateItinerary({ 
        destination, 
        days, 
        travelStyle: "Balanced",
        interests: ["culture", "food", "sightseeing"] 
      });
      setItinerary(result.data || result);
      toast.success("Your personalized itinerary is ready!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to generate itinerary. Please log in first!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl mb-6 shadow-xl">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            AI Travel Planner
          </h1>
          <p className="text-sm md:text-md text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Let our advanced AI create your perfect itinerary in seconds — personalized to your style, budget, and interests.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>AI-Powered Planning</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>10K+ Trips Planned</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>4.9 Rating</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-heading">Trip Details</h2>
              </div>
              
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="destination" className="text-base font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Where to?
                  </Label>
                  <Input 
                    id="destination" 
                    placeholder="e.g., Tokyo, Paris, Bali..." 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)} 
                    className="h-12 text-lg rounded-xl border-2 focus:border-primary/50 transition-all"
                    required 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="days" className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Duration (Days)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl"
                      onClick={() => setDays(Math.max(1, days - 1))}
                    >
                      -
                    </Button>
                    <Input 
                      id="days" 
                      type="number" 
                      min="1" 
                      max="14" 
                      value={days} 
                      onChange={(e) => setDays(Math.min(14, Math.max(1, parseInt(e.target.value) || 1)))} 
                      className="h-12 text-center text-lg rounded-xl flex-1"
                      required 
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl"
                      onClick={() => setDays(Math.min(14, days + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg mt-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={loading || !destination}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Crafting Your Journey...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate Itinerary 
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Features List */}
              <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">What's included:</p>
                <div className="space-y-2">
                  {['Daily activity schedule', 'Local tips & insights', 'Budget breakdown', 'Packing recommendations', 'Local phrases'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center min-h-[500px] text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-ping" />
                    <div className="relative animate-spin-slow">
                      <Compass className="h-20 w-20 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-heading">Crafting Your Perfect Journey</h3>
                  <p className="text-muted-foreground">Analyzing top attractions, local secrets, and optimal routes...</p>
                  <div className="flex gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              ) : itinerary ? (
                <div ref={itineraryRef} className="space-y-6">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                    {/* Header */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-3xl p-6 md:p-8"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="text-sm font-semibold text-primary">AI-Generated Itinerary</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">{itinerary.title}</h2>
                      <p className="text-muted-foreground text-lg mb-4 leading-relaxed">{itinerary.summary}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Total: {itinerary.currency} {itinerary.totalEstimatedCost}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{itinerary.days?.length} Days Adventure</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Day Navigation */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mt-6">
                      {itinerary.days?.map((day) => (
                        <Button
                          key={day.day}
                          variant={activeDay === day.day ? "default" : "outline"}
                          onClick={() => setActiveDay(day.day)}
                          className="rounded-full gap-2 whitespace-nowrap"
                        >
                          <Sun className="h-4 w-4" />
                          Day {day.day}: {day.theme}
                        </Button>
                      ))}
                    </div>

                    {/* Days Content */}
                    <AnimatePresence mode="wait">
                      {itinerary.days?.map((day) => (
                        activeDay === day.day && (
                          <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl overflow-hidden shadow-xl mt-6"
                          >
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-primary/20">
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
                                  <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0 hover:bg-muted/10 rounded-xl p-3 transition-colors"
                                  >
                                    <div className="flex-shrink-0 w-16 text-right">
                                      <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                        {activity.time}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <h4 className="font-bold text-lg">{activity.place}</h4>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                                          <Icon className="h-3 w-3" />
                                          {activity.category}
                                        </span>
                                      </div>
                                      <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{activity.description}</p>
                                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                                          <Clock className="h-3 w-3" />
                                          {activity.duration}
                                        </span>
                                        <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                                          <DollarSign className="h-3 w-3" />
                                          {itinerary.currency} {activity.estimatedCost}
                                        </span>
                                        <span className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                                          <Lightbulb className="h-3 w-3 text-yellow-500" />
                                          {activity.tip}
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>

                    {/* Packing Tips & Local Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {itinerary.packingTips && itinerary.packingTips.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6"
                        >
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" /> 
                            Packing Essentials
                          </h3>
                          <ul className="space-y-2">
                            {itinerary.packingTips.map((tip, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-muted-foreground text-sm">
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      
                      {itinerary.bestTimeToVisit && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6"
                        >
                          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" /> 
                            Best Time to Visit
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{itinerary.bestTimeToVisit}</p>
                        </motion.div>
                      )}
                      
                      {itinerary.localPhrases && itinerary.localPhrases.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6 md:col-span-2"
                        >
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Languages className="h-5 w-5 text-primary" /> 
                            Local Phrases to Know
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {itinerary.localPhrases.map((phrase, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                                <span className="font-medium">{phrase.phrase}</span>
                                <span className="text-muted-foreground text-sm">→ {phrase.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-dashed border-border/50 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[500px] text-center group hover:border-primary/30 transition-colors"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Map className="h-20 w-20 text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-110 mb-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-muted-foreground font-heading">Ready to Explore?</h3>
                  <p className="text-muted-foreground max-w-md leading-relaxed">
                    Tell us where you want to go and for how long. Our AI will create a personalized day-by-day itinerary just for you.
                  </p>
                  <div className="flex gap-2 mt-6">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Local experiences</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      <span>Hidden gems</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Compass className="h-4 w-4" />
                      <span>Insider tips</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}