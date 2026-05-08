'use client';

import { Search, Bot, Compass, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

export function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Discover Destinations",
      description: "Browse our curated list of global destinations or use our AI chat to find your perfect match.",
      highlight: "1,500+ destinations",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "Plan with AI",
      description: "Let our AI generate a day-by-day itinerary, budget analysis, and smart packing list.",
      highlight: "AI-powered planning",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
    },
    {
      icon: <Compass className="h-8 w-8 text-primary" />,
      title: "Book & Experience",
      description: "Reserve authentic local experiences and enjoy your flawlessly planned journey.",
      highlight: "24/7 support",
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconBg: "bg-emerald-500/10",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-8 md:py-16 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple Process</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How WanderMind Works
          </h2>
          <p className="text-md md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your next adventure is just three simple steps away. Let us help you create unforgettable memories.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-3 -left-3 z-20">
                <div className="h-8 w-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Card */}
              <div className={`relative h-full p-6 md:p-8 rounded-3xl bg-card border border-border/50 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-primary/30 overflow-hidden ${
                hoveredIndex === index ? 'transform -translate-y-2' : ''
              }`}>
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Icon Container */}
                <div className={`relative z-10 h-16 w-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                  
                  {/* Highlight Badge */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 bg-primary/10 rounded-full px-3 py-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{step.highlight}</span>
                  </div>
                </div>

                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Connecting Arrow (Desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                  <div className="flex items-center">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}