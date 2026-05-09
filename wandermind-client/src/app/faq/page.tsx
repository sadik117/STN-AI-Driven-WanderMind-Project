'use client';

import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail, ChevronRight, Search, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'General',
      items: [
        {
          question: 'What is WanderMind?',
          answer: 'WanderMind is an AI-powered travel platform that helps you discover destinations, generate personalized itineraries, and book unique local experiences directly from hosts.'
        },
        {
          question: 'How does the AI Trip Planner work?',
          answer: 'Our AI analyzes your preferences (budget, interests, duration) and scans thousands of destinations and activities to create a day-by-day plan tailored specifically for you.'
        }
      ]
    },
    {
      category: 'Booking & Payments',
      items: [
        {
          question: 'How do I book an experience?',
          answer: 'Simply navigate to any experience page, select your preferred date and number of guests, and click "Book Now". You can manage all your bookings from your traveler dashboard.'
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'Cancellation policies vary by experience and are set by the hosts. You can find the specific policy for each activity listed on its detail page under the "Policies" section.'
        }
      ]
    },
    {
      category: 'Hosting',
      items: [
        {
          question: 'How can I become a host?',
          answer: 'To become a host, register an account and select "Host" as your role. You can then complete your host profile and start listing your unique experiences.'
        },
        {
          question: 'What are the hosting fees?',
          answer: 'WanderMind charges a small service fee on each successful booking to help maintain the platform and provide 24/7 support. Hosts keep the majority of their earnings.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="flex-1 pb-12">
      {/* Header Section */}
      <section className="relative py-18 bg-muted/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight">How can we <span className="text-primary italic">help you?</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about WanderMind, bookings, and our AI travel tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search for answers..."
              className="h-14 pl-12 pr-4 rounded-2xl bg-background shadow-xl border-border/50 text-lg focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-16">
              {filteredFaqs.map((category, catIdx) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.1 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold font-heading px-2 border-l-4 border-primary ml-2">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.items.map((item, itemIdx) => (
                      <AccordionItem 
                        key={itemIdx} 
                        value={`${catIdx}-${itemIdx}`}
                        className="border border-border/50 rounded-2xl bg-card px-6 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-lg transition-all"
                      >
                        <AccordionTrigger className="text-left py-6 hover:no-underline hover:text-primary font-bold text-lg">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed text-base">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-muted/20 rounded-[3rem] border border-dashed">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or browse our categories.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold font-heading">Still have questions?</h2>
              <p className="text-muted-foreground">Our support team is available 24/7 to help you with any issues.</p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <Link href="/contact">
                <Button className="rounded-xl h-12 px-6 gap-2">
                  <Mail className="h-4 w-4" /> Contact Us
                </Button>
                </Link>
                <Button
                onClick={() => toast.info('Live Chat is coming soon!')}
                 variant="outline" className="rounded-xl h-12 px-6 gap-2">
                  <MessageCircle className="h-4 w-4" /> Live Chat
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-background p-6 rounded-3xl shadow-2xl border border-border/50 max-w-[280px] ml-auto relative z-10"
              >
                <div className="flex gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-primary/10 rounded w-full" />
                  <div className="h-3 bg-primary/10 rounded w-5/6" />
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
