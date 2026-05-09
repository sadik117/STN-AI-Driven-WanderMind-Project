"use client"

import { useState } from "react";
import { aiService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  MapPin, 
  Calendar, 
  Activity, 
  Briefcase, 
  Sun, 
  AlertCircle,
  Loader2,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PackingItem {
  name: string;
  essential: boolean;
  quantity: string;
}

interface PackingCategory {
  name: string;
  icon: string;
  items: PackingItem[];
}

interface PackingListData {
  destination: string;
  totalItems: number;
  categories: PackingCategory[];
  weatherNote: string;
  importantReminders: string[];
}

export default function SmartPackingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [packingList, setPackingList] = useState<PackingListData | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    tripType: "Leisure",
    activities: ""
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to generate a smart packing list!");
      router.push("/login?redirect=/smart-packing");
      return;
    }

    if (!formData.destination) {
      toast.error("Please enter a destination.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tripType: formData.tripType,
        activities: formData.activities.split(',').map(a => a.trim()).filter(a => a)
      };

      const result = await aiService.generatePackingList(payload);
      setPackingList(result.data || result);
      setCheckedItems({}); // reset checked items
      toast.success("Your smart packing list is ready!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to generate packing list.");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateProgress = () => {
    if (!packingList) return 0;
    const total = packingList.totalItems || Object.keys(checkedItems).length; // fallback
    if (total === 0) return 0;
    const checked = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checked / total) * 100);
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
            <Package className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Smart Packing Generator
          </h1>
          <p className="text-sm md:text-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Never forget the essentials again. Tell us about your trip, and our AI will craft the perfect, categorized packing list tailored to your destination, weather, and activities.
          </p>
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
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-heading">Trip Details</h2>
              </div>
              
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destination
                  </Label>
                  <Input 
                    id="destination" 
                    placeholder="e.g., Swiss Alps, Bali..." 
                    value={formData.destination} 
                    onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                    className="h-12 rounded-xl"
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Start Date
                    </Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={formData.startDate} 
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      End Date
                    </Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={formData.endDate} 
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tripType" className="text-sm font-semibold flex items-center gap-2">
                    <Sun className="h-4 w-4 text-primary" />
                    Trip Type
                  </Label>
                  <Select value={formData.tripType} onValueChange={(val) => setFormData({...formData, tripType: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leisure">Leisure & Relaxation</SelectItem>
                      <SelectItem value="Adventure">Adventure & Outdoors</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Family">Family Trip</SelectItem>
                      <SelectItem value="Romantic">Romantic Getaway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activities" className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Planned Activities (comma separated)
                  </Label>
                  <Input 
                    id="activities" 
                    placeholder="e.g., hiking, swimming, formal dinner" 
                    value={formData.activities} 
                    onChange={(e) => setFormData({...formData, activities: e.target.value})} 
                    className="h-12 rounded-xl"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg mt-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300"
                  disabled={loading || !formData.destination}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate List
                      <Package className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
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
                  <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                  <h3 className="text-2xl font-bold mb-3 font-heading">Packing your virtual bags...</h3>
                  <p className="text-muted-foreground">Analyzing weather patterns and activity requirements...</p>
                </motion.div>
              ) : packingList ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Top Stats & Progress */}
                  <div className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div>
                        <h2 className="text-3xl font-bold font-heading mb-2">Packing for {packingList.destination}</h2>
                        <p className="text-muted-foreground">{packingList.totalItems} items carefully selected for your trip.</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold text-primary">{calculateProgress()}%</span>
                        <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Packed</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden mb-8">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateProgress()}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>

                    {/* Weather & Reminders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-2xl p-4 flex gap-3">
                        <Sun className="h-6 w-6 text-blue-500 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Weather Forecast</h4>
                          <p className="text-sm text-blue-600/80 dark:text-blue-300/80 leading-relaxed">{packingList.weatherNote}</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-2xl p-4 flex gap-3">
                        <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Important Reminders</h4>
                          <ul className="text-sm text-amber-600/80 dark:text-amber-300/80 space-y-1 list-disc list-inside">
                            {packingList.importantReminders?.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packingList.categories?.map((cat, catIdx) => (
                      <motion.div 
                        key={catIdx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: catIdx * 0.1 }}
                        className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className="bg-muted/30 px-5 py-4 border-b border-border/50 flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <h3 className="font-bold text-lg font-heading">{cat.name}</h3>
                          <span className="ml-auto text-xs font-semibold bg-background px-2 py-1 rounded-full text-muted-foreground">
                            {cat.items?.length} items
                          </span>
                        </div>
                        <div className="p-2">
                          {cat.items?.map((item, itemIdx) => {
                            const isChecked = checkedItems[`${catIdx}-${itemIdx}`];
                            return (
                              <div 
                                key={itemIdx}
                                onClick={() => toggleItem(catIdx, itemIdx)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isChecked ? 'bg-primary/5 opacity-70' : 'hover:bg-muted/50'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-6 w-6 rounded-md flex items-center justify-center transition-all ${isChecked ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30'}`}>
                                    {isChecked && <Check className="h-4 w-4" />}
                                  </div>
                                  <span className={`font-medium ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                    {item.name}
                                  </span>
                                  {item.essential && !isChecked && (
                                    <span className="text-[10px] uppercase font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-sm">
                                      Essential
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                  {item.quantity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-dashed border-border/50 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[500px] text-center group"
                >
                  <Package className="h-20 w-20 text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-110 mb-6" />
                  <h3 className="text-2xl font-bold mb-3 text-muted-foreground font-heading">Ready to Pack?</h3>
                  <p className="text-muted-foreground max-w-md leading-relaxed">
                    Fill in your trip details on the left, and let us generate the ultimate packing list so you can focus on the adventure ahead.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
