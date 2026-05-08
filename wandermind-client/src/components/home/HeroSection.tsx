'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, Sparkles, Compass, Globe, Camera, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
    location: "Bali, Indonesia",
    title: "Paradise Found",
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    location: "Patagonia, Chile",
    title: "Wilderness Awaits",
  },
  {
    url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
    location: "Paris, France",
    title: "City of Lights",
  },
  {
    url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop",
    location: "Marrakech, Morocco",
    title: "Colors of Culture",
  },
  {
    url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2057&auto=format&fit=crop",
    location: "Tokyo, Japan",
    title: "Future Meets Tradition",
  },
  {
    url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1972&auto=format&fit=crop",
    location: "Amalfi Coast, Italy",
    title: "La Dolce Vita",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentImage = heroImages[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);


  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Reset auto-play after user interaction (optional - after 5 seconds of no interaction)
  useEffect(() => {
    if (!isAutoPlaying) {
      const timer = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 5000); // Resume auto-play after 5 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying]);

  return (
    <div className="relative py-60 h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${currentImage.url}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Location Badge - Floating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 shadow-xl">
          <div className="flex items-center gap-2 text-white">
            <Compass className="h-4 w-4" />
            <span className="text-sm font-medium">{currentImage.location}</span>
            <Camera className="h-3 w-3 ml-2 opacity-70" />
            <span className="text-xs opacity-70">{currentImage.title}</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        > 
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight"
        >
          Where will you{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            wander
          </span>{" "}
          next?
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
        >
          Discover incredible destinations, plan personalized AI-generated itineraries, and book unforgettable local experiences.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/ai-planner">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg h-14 px-8 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 group"
            >
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Plan with AI
            </Button>
          </Link>
          <Link href="/destinations">
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto text-lg h-14 px-8 gap-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <Map className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Explore Places
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-primary' 
                : 'w-1.5 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}