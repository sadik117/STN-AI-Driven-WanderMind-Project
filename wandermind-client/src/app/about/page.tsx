'use client';

import { motion } from 'framer-motion';
import { Globe, Heart, Shield, Users, Map, Sparkles, Compass, Backpack } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Destinations', value: '500+', icon: Map },
    { label: 'Happy Travelers', value: '50K+', icon: Users },
    { label: 'Expert Guides', value: '1.2K+', icon: Compass },
    { label: 'Success Rate', value: '99%', icon: Shield },
  ];

  const values = [
    {
      title: 'Our Mission',
      description: 'To democratize high-end travel planning by leveraging artificial intelligence to create personalized, unforgettable experiences for every traveler.',
      icon: Target,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Sustainability',
      description: 'We promote responsible tourism by partnering with local hosts and highlighting eco-friendly destinations to preserve our planet for future generations.',
      icon: Leaf,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Community First',
      description: 'WanderMind is built on the passion of our global community. We empower local hosts to share their culture and unique stories with the world.',
      icon: Heart,
      color: 'bg-rose-500/10 text-rose-500',
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-4 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Revolutionizing Travel
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground"
            >
              We Believe the World is <span className="text-primary italic">Better Shared</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              WanderMind was born out of a simple idea: that travel planning shouldn't be a chore, and finding authentic experiences shouldn't be a gamble.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="h-12 w-12 bg-background rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-border/50 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-heading">{stat.value}</h3>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">Our Story: From a Backpacker's Dream to AI Reality</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                It started in a small cafe in Kyoto, where our founder realized that most travelers spend more time planning their trips than actually experiencing them.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By combining cutting-edge AI technology with the deep, localized knowledge of hosts worldwide, we've created a platform that doesn't just show you where to go, but helps you discover why you should go there.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <Backpack className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-bold">Founded in 2023</p>
                    <p className="text-xs text-muted-foreground">Start-up of the year</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <Globe className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-bold">Global Presence</p>
                    <p className="text-xs text-muted-foreground">Operating in 45+ countries</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden aspect-[4/5] lg:aspect-square shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                alt="Our Team" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">Our Core Values</h2>
            <p className="text-muted-foreground">These principles guide everything we build at WanderMind.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full rounded-3xl border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl group">
                  <CardContent className="p-8 space-y-6">
                    <div className={`h-16 w-16 ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const Leaf = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-10 10Z" />
    <path d="M11 20V10" />
  </svg>
);

const Target = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
