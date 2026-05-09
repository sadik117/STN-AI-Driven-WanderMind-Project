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
  Calculator, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Wallet, 
  TrendingDown, 
  Sparkles,
  Loader2,
  PieChart,
  Target
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function BudgetAnalyzerPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState<any>(null);

  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    groupSize: 1,
    travelStyle: "Moderate",
    totalBudget: ""
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to use the budget analyzer!");
      router.push("/login?redirect=/budget-analyzer");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        days: Number(formData.days),
        groupSize: Number(formData.groupSize),
        totalBudget: formData.totalBudget ? Number(formData.totalBudget) : undefined
      };

      const result = await aiService.analyzeBudget(payload);
      setBudgetData(result.data || result);
      toast.success("Budget analysis complete!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to analyze budget.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const renderProgress = (value: number, total: number, colorClass: string) => {
    const percentage = Math.min(100, Math.max(0, (value / total) * 100));
    return (
      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className={`h-2.5 rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl mb-6 shadow-xl">
            <Calculator className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            AI Budget Analyzer
          </h1>
          <p className="text-sm md:text-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plan your finances with confidence. Get a detailed cost breakdown, money-saving tips, and learn where to splurge for your dream trip.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-heading">Trip Details</h2>
              </div>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Destination</Label>
                  <Input value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="h-12 rounded-xl" placeholder="e.g., Tokyo, Japan" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Days</Label>
                    <Input type="number" min="1" value={formData.days} onChange={(e) => setFormData({...formData, days: parseInt(e.target.value) || 1})} className="h-12 rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Group Size</Label>
                    <Input type="number" min="1" value={formData.groupSize} onChange={(e) => setFormData({...formData, groupSize: parseInt(e.target.value) || 1})} className="h-12 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Travel Style</Label>
                  <Select value={formData.travelStyle} onValueChange={(val) => setFormData({...formData, travelStyle: val})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Style" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Budget">Budget / Backpacker</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Comfortable">Comfortable</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Planned Budget (Optional)</Label>
                  <Input type="number" placeholder="Total in USD" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <Button type="submit" className="w-full h-14 text-lg mt-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 shadow-lg" disabled={loading || !formData.destination}>
                  {loading ? <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</span> : <span className="flex items-center gap-2">Analyze Budget <PieChart className="h-4 w-4" /></span>}
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border-2 border-border/50 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                  <h3 className="text-2xl font-bold mb-3 font-heading text-center">Crunching the numbers...</h3>
                  <p className="text-muted-foreground">Checking local prices and accommodation rates...</p>
                </motion.div>
              ) : budgetData ? (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
                      <p className="text-muted-foreground font-semibold mb-2">Estimated Total</p>
                      <h3 className="text-4xl font-bold text-primary">${budgetData.estimatedTotal}</h3>
                      <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">{budgetData.currency}</p>
                    </div>
                    <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
                      <p className="text-muted-foreground font-semibold mb-2">Per Person / Day</p>
                      <h3 className="text-3xl font-bold">${budgetData.perPersonPerDay}</h3>
                      <p className="text-xs text-primary font-bold mt-2 bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">{budgetData.budgetLabel}</p>
                    </div>
                    <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
                      <p className="text-muted-foreground font-semibold mb-2">Affordability Score</p>
                      <h3 className={`text-4xl font-bold ${getScoreColor(budgetData.budgetScore)}`}>{budgetData.budgetScore}<span className="text-lg text-muted-foreground">/100</span></h3>
                      <p className="text-xs text-muted-foreground mt-2">100 = very affordable</p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-card border-2 border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 font-heading flex items-center gap-2"><PieChart className="h-6 w-6 text-primary" /> Cost Breakdown</h3>
                    <div className="space-y-5">
                      {[
                        { label: 'Accommodation', val: budgetData.breakdown.accommodation, color: 'bg-blue-500' },
                        { label: 'Food & Dining', val: budgetData.breakdown.food, color: 'bg-orange-500' },
                        { label: 'Transport', val: budgetData.breakdown.transport, color: 'bg-green-500' },
                        { label: 'Activities', val: budgetData.breakdown.activities, color: 'bg-purple-500' },
                        { label: 'Shopping', val: budgetData.breakdown.shopping, color: 'bg-pink-500' },
                        { label: 'Miscellaneous', val: budgetData.breakdown.misc, color: 'bg-gray-500' }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                              {item.label}
                            </span>
                            <span>${item.val}</span>
                          </div>
                          {renderProgress(item.val, budgetData.estimatedTotal, item.color)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-500/10 border-2 border-green-500/20 rounded-3xl p-6 shadow-md">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-400"><TrendingDown className="h-5 w-5" /> Saving Tips</h3>
                      <ul className="space-y-3 text-sm text-green-800 dark:text-green-300">
                        {budgetData.savingTips.map((tip: string, idx: number) => <li key={idx} className="flex gap-2 font-medium"><Target className="h-4 w-4 shrink-0 mt-0.5" /> {tip}</li>)}
                      </ul>
                    </div>
                    <div className="bg-purple-500/10 border-2 border-purple-500/20 rounded-3xl p-6 shadow-md">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-400"><Sparkles className="h-5 w-5" /> Splurge Worthy</h3>
                      <ul className="space-y-3 text-sm text-purple-800 dark:text-purple-300">
                        {budgetData.splurgeWorthy.map((tip: string, idx: number) => <li key={idx} className="flex gap-2 font-medium"><Target className="h-4 w-4 shrink-0 mt-0.5" /> {tip}</li>)}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border-2 border-dashed border-border/50 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center min-h-[500px] text-center group hover:border-primary/50 transition-colors">
                  <Calculator className="h-20 w-20 text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-110 mb-6" />
                  <h3 className="text-2xl font-bold mb-3 text-muted-foreground font-heading">Ready to plan your budget?</h3>
                  <p className="text-muted-foreground max-w-md">Enter your destination and trip details to get an AI-powered financial breakdown and money-saving strategies.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
