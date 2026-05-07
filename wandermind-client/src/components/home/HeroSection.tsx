import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, Sparkles, Calendar, Navigation } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
          Where will you wander next?
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium">
          Discover incredible destinations, plan personalized AI-generated itineraries, and book unforgettable local experiences.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/ai-planner">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Sparkles className="h-5 w-5" />
              Plan with AI
            </Button>
          </Link>
          <Link href="/destinations">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg h-14 px-8 gap-2 bg-white text-black hover:bg-white/90 shadow-lg transition-transform hover:scale-105">
              <Map className="h-5 w-5" />
              Explore Places
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Bottom Wave/Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
