'use client';

import Link from 'next/link';
import { 
  Map,  
  Mail, 
  Heart, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  Info,
  HelpCircle,
  Shield,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const footerLinks = {
    explore: [
      { name: 'Destinations', href: '/destinations', icon: MapPin },
      { name: 'Experiences', href: '/experiences', icon: Sparkles },
      { name: 'AI Trip Planner', href: '/ai-planner', icon: Map },
      { name: 'Travel Blog', href: '/blog', icon: BookOpen },
    ],
    company: [
      { name: 'About Us', href: '/about', icon: Info },
      { name: 'FAQs', href: '/faq', icon: HelpCircle },
      { name: 'Contact', href: '/contact', icon: Mail },
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative bg-gradient-to-b from-background via-background to-primary/5 border-t border-border/50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 md:py-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <motion.div 
                className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Map className="h-6 w-6" />
              </motion.div>
              <span className="font-heading font-bold text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                WanderMind
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Your AI-powered travel companion. Discover destinations, plan personalized itineraries, and book unforgettable experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>sadiksourov11@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+8801717375585</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Rajshahi, Bangladesh</span>
              </div>
            </div>
          </motion.div>

          {/* Explore Links */}
          <motion.div variants={itemVariants} className="col-span-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Explore
            </h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants} className="col-span-2">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-border/50 py-6 flex flex-col  md:flex-row items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} WanderMind. All rights reserved. Made with{' '}
            <Heart className="h-3 w-3 inline text-red-500 animate-pulse" /> for travelers.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}