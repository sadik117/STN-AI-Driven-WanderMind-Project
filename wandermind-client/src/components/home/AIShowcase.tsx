import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function AIShowcase() {
  const features = [
    "Personalized day-by-day itineraries based on your interests.",
    "Smart budget estimation and optimization tips.",
    "Custom packing lists tailored to the destination weather.",
    "Interactive travel journal summarization."
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl opacity-50" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Travel</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
              Say goodbye to hours of planning.
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              WanderMind uses advanced AI to craft the perfect trip. Tell us where you want to go, your travel style, and budget, and we'll handle the rest in seconds.
            </p>
            
            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Link href="/plan">
                <Button size="lg" className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
                  Try the AI Planner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            {/* Visual Representation of the AI tool */}
            <div className="relative rounded-2xl border border-border/50 bg-card shadow-2xl p-6 lg:p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Generating Itinerary...</h3>
                    <p className="text-sm text-muted-foreground">5 Days in Kyoto, Japan</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((day) => (
                    <div key={day} className="flex gap-4 animate-pulse">
                      <div className="w-16 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        Day {day}
                      </div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 flex justify-center">
                    <div className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent animate-ping" />
                      Analyzing budget data
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
