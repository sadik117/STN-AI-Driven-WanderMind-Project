'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, CheckCircle, Info, ChevronRight, Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Eye,
      content: 'We collect information you provide directly to us when you create an account, search for destinations, book experiences, or contact support. This includes your name, email address, payment information, and travel preferences.'
    },
    {
      title: 'How We Use Your Data',
      icon: CheckCircle,
      content: 'We use the collected data to personalize your travel planning experience, process your bookings, communicate with you about your trips, and improve our AI algorithms to provide better recommendations.'
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: 'We implement industry-standard security measures including SSL encryption and secure data storage to protect your personal information from unauthorized access, disclosure, or alteration.'
    },
    {
      title: 'Your Rights',
      icon: Scale,
      content: 'You have the right to access, update, or delete your personal data at any time. You can manage your privacy settings through your account dashboard or contact us for data portability requests.'
    }
  ];

  return (
    <div className="flex-1 pb-14">
      {/* Header */}
      <section className="relative py-18 bg-muted/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight">Privacy <span className="text-primary italic">Policy</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              At WanderMind, we are committed to protecting your personal data and your privacy. This policy outlines how we handle your information.
            </p>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest pt-4">Last Updated: May 10, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full rounded-3xl border-border/50 bg-card hover:border-primary/30 transition-all group">
                <CardContent className="p-8 space-y-6">
                  <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading">{section.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert bg-muted/20 p-8 md:p-16 rounded-[3rem] border border-border/50">
          <div className="flex items-center gap-3 mb-8 text-primary">
            <FileText className="h-6 w-6" />
            <h2 className="text-3xl font-bold font-heading m-0">Full Privacy Terms</h2>
          </div>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-primary" />
                1. Introduction
              </h3>
              <p className="text-muted-foreground">
                WanderMind ("we", "our", or "us") operates the website and AI travel planning services. This document informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-primary" />
                2. Data Sharing
              </h3>
              <p className="text-muted-foreground">
                We do not sell your personal data. We only share information with third parties (like hosts or payment processors) when it is absolutely necessary to fulfill your bookings or provide the AI services you've requested.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-primary" />
                3. Cookies and Tracking
              </h3>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-border/50">
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <Info className="h-6 w-6 text-primary shrink-0" />
                <p className="text-sm font-medium m-0">
                  By using WanderMind, you agree to the collection and use of information in accordance with this policy. If you have any questions, please contact us at privacy@wandermind.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
