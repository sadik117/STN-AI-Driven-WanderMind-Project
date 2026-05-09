'use client';

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Globe, 
  Users, 
  Heart, 
  Calendar, 
  Star, 
  MapPin, 
  Coffee,
  Rocket,
  Award,
  BookOpen,
  Sparkles
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { appStatsQuery, AppStats } from "@/services/stats.service";


export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: stats, isLoading, isError } = useQuery<AppStats>(appStatsQuery);

  const statItems = [
    {
      label: "Destinations",
      value: stats?.destinations || 0,
      icon: Globe,
      gradient: "from-blue-500 to-cyan-500",
      suffix: "+",
      description: "amazing places",
    },
    {
      label: "Experiences",
      value: stats?.experiences || 0,
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      suffix: "+",
      description: "unique activities",
    },
    {
      label: "Travelers",
      value: stats?.travelers || 0,
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      suffix: "+",
      description: "happy explorers",
    },
    {
      label: "Hosts",
      value: stats?.hosts || 0,
      icon: Heart,
      gradient: "from-rose-500 to-orange-500",
      suffix: "+",
      description: "local experts",
    },
    {
      label: "Bookings",
      value: stats?.bookings || 0,
      icon: Calendar,
      gradient: "from-indigo-500 to-purple-500",
      suffix: "+",
      description: "confirmed trips",
    },
    {
      label: "Itineraries",
      value: stats?.itineraries || 0,
      icon: MapPin,
      gradient: "from-amber-500 to-yellow-500",
      suffix: "+",
      description: "AI generated",
    },
    {
      label: "Reviews",
      value: stats?.reviews || 0,
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      suffix: "+",
      description: "5-star ratings",
    },
    {
      label: "Blog Posts",
      value: stats?.blogs || 0,
      icon: BookOpen,
      gradient: "from-cyan-500 to-blue-500",
      suffix: "+",
      description: "travel stories",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Format numbers with K, M suffixes
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (isError) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Unable to load statistics</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 md:py-14 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Platform Statistics</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            By the Numbers
          </h2>
          <p className="text-md md:text-xl text-muted-foreground">
            Trusted by thousands of travelers worldwide
          </p>
        </motion.div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-4 w-24 mx-auto mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {statItems.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <div className="relative bg-card rounded-2xl p-6 text-center border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                    {/* Icon */}
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Value */}
                    <div className="mt-6">
                      <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        {formatNumber(stat.value)}
                        {stat.suffix}
                      </div>
                      <div className="font-semibold text-primary mt-2">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </div>
                    </div>

                    {/* Decorative Line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 pt-4 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <span className="text-sm font-medium">{stats?.avgDestinationRating || 4.8} Average Rating</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">500+ Daily Bookings</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Trusted Platform</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}