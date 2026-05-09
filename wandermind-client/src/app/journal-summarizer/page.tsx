"use client"

import { useState } from "react";
import { aiService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Sparkles,
  Loader2,
  PenTool,
  Quote,
  Star,
  Hash
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalSummarizerPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [journalData, setJournalData] = useState<any>(null);

  const [formData, setFormData] = useState({
    destination: "",
    travelDate: "",
    rawNotes: ""
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to summarize your journal!");
      router.push("/login?redirect=/journal-summarizer");
      return;
    }
    if (formData.rawNotes.length < 10) {
      toast.error("Please write at least a few sentences (10+ characters) in your raw notes.");
      return;
    }
    setLoading(true);
    try {
      const result = await aiService.summarizeJournal(formData);
      setJournalData(result.data || result);
      toast.success("Journal summarized successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to summarize journal.");
    } finally {
      setLoading(false);
    }
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
            <PenTool className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            AI Journal Summarizer
          </h1>
          <p className="text-sm md:text-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn your chaotic, brain-dumped travel notes into a beautifully polished journal entry. Perfect for blogs, social media, or memory keeping.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-heading">Your Raw Notes</h2>
              </div>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Destination</Label>
                    <Input value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="h-12 rounded-xl" required placeholder="e.g. Paris" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Date</Label>
                    <Input type="date" value={formData.travelDate} onChange={(e) => setFormData({...formData, travelDate: e.target.value})} className="h-12 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><PenTool className="h-4 w-4 text-primary" /> Brain Dump</Label>
                  <Textarea 
                    value={formData.rawNotes} 
                    onChange={(e) => setFormData({...formData, rawNotes: e.target.value})} 
                    className="min-h-[250px] rounded-xl resize-none p-4 leading-relaxed focus-visible:ring-primary" 
                    placeholder="Type all your messy, unorganized thoughts. What did you eat? Where did you walk? Any funny things that happened? The AI will magically polish it..." 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full h-14 text-lg mt-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 shadow-lg transition-transform active:scale-[0.98]" disabled={loading || !formData.destination || !formData.rawNotes}>
                  {loading ? <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Sprinkling AI Magic...</span> : <span className="flex items-center gap-2">Summarize Journal <Sparkles className="h-4 w-4" /></span>}
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border-2 border-border/50 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center h-full min-h-[500px]">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                  <h3 className="text-2xl font-bold mb-3 font-heading text-center">Weaving your story...</h3>
                  <p className="text-muted-foreground text-center max-w-sm">Polishing your sentences and extracting the best highlights.</p>
                </motion.div>
              ) : journalData ? (
                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -z-10" />
                  
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h2 className="text-3xl font-bold font-heading text-primary leading-tight">{journalData.title}</h2>
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-3 py-1.5 rounded-full font-bold text-sm shrink-0">
                      <Star className="h-4 w-4 fill-current" /> {journalData.rating}/5
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none mb-8">
                    {journalData.summary.split('\n').map((p: string, i: number) => (
                      p.trim() && <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-base">{p}</p>
                    ))}
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 mb-8 relative shadow-sm">
                    <Quote className="absolute -top-4 -left-2 h-10 w-10 text-primary/30" />
                    <p className="font-medium italic text-lg px-6 leading-relaxed">"{journalData.quote}"</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-5 font-heading flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" /> Top Highlights
                    </h3>
                    <ul className="space-y-4">
                      {journalData.highlights.map((h: string, i: number) => (
                        <li key={i} className="flex gap-4 items-start bg-muted/30 p-3 rounded-2xl">
                          <span className="bg-primary text-primary-foreground h-8 w-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                            {i+1}
                          </span>
                          <span className="text-sm font-medium leading-relaxed pt-1">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-auto pt-6 border-t border-border/50">
                    <span className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                      Mood: {journalData.mood}
                    </span>
                    <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
                    {journalData.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs font-semibold text-muted-foreground bg-muted hover:bg-muted/80 cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                        <Hash className="h-3 w-3" /> {tag.replace('#', '')}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border-2 border-dashed border-border/50 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center h-full min-h-[500px] text-center group hover:border-primary/50 transition-colors">
                  <FileText className="h-20 w-20 text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:scale-110 mb-6" />
                  <h3 className="text-2xl font-bold mb-3 text-muted-foreground font-heading">Your Polished Journal</h3>
                  <p className="text-muted-foreground max-w-md leading-relaxed">Your AI-summarized entry will appear here, complete with highlights, quotes, and hashtags ready to share.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
