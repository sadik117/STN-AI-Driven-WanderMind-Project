'use client';

import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Heart, Sparkles, CheckCircle, ArrowRight, Star, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactMethods = [
    {
      title: 'Email Us',
      value: 'sadiksourov11@gmail.com',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      description: 'We reply within 24 hours',
    },
    {
      title: 'Call Us',
      value: '+8801717375585',
      icon: Phone,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-500/10',
      description: 'Saturday-Thursday, 10AM - 7PM',
    },
    {
      title: 'Visit Us',
      value: 'Rajshahi, Bangladesh',
      icon: MapPin,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10',
      description: 'Drop by our office',
    },
  ];

  const faqs = [
    { question: 'How do I book an experience?', answer: 'Simply browse experiences, select your preferred date, and complete the booking form.' },
    { question: 'Can I cancel my booking?', answer: 'Yes, free cancellation up to 48 hours before the experience start time.' },
    { question: 'Is my payment secure?', answer: 'Absolutely! We use industry-standard encryption for all transactions.' },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Travelers', icon: Users },
    { value: '4.9', label: 'Average Rating', icon: Star },
    { value: '24/7', label: 'Support', icon: Clock },
    { value: '100%', label: 'Satisfaction', icon: Award },
  ];

  return (
    <div className="flex-1 pb-12 md:pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 bg-gradient-to-br from-primary/20 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 mt-2 md:-mt-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <Badge className="mx-auto w-fit bg-primary/10 text-primary border-none px-4 py-2 text-sm animate-pulse">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              Get in Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight">
              Let's{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent italic">
                Connect
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a question about a destination or need help with a booking? Our team is here to help you 24/7.
            </p>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="container mx-auto px-4 -mt-16 relative z-20" ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {contactMethods.map((method, idx) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{method.title}</p>
                      <p className="text-base md:text-lg font-bold">{method.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="text-center p-3 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="rounded-3xl border-border/50 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-primary/10 to-transparent px-8 pt-8 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold font-heading">Send a Message</h2>
                  </div>
                  <p className="text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Full Name *</label>
                        <Input 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe" 
                          className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-all" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Email Address *</label>
                        <Input 
                          name="email"
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com" 
                          className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-all" 
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Subject *</label>
                      <Input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Booking Inquiry / Support Request / Partnership" 
                        className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 transition-all" 
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Your Message *</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?" 
                        className="min-h-[180px] rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 p-4 resize-none" 
                        required
                      />
                    </div>

                    <Button 
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      By submitting, you agree to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Find quick answers to common questions</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="rounded-2xl border-border/50 hover:border-primary/30 transition-all h-full hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map Section with Interactive Map */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 group"
        >
          {/* Google Maps Embed */}
          <div className="relative h-[450px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.37672021143!2d88.63506087300298!3d24.368194978253864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbf02db6d04b59%3A0xaa58eb411ea3ec5c!2sUniversity%20of%20Rajshahi!5e0!3m2!1sen!2sbd!4v1778357906577!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-700"
              title="WanderMind Location Map"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Location Card Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-background/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-border/50 min-w-[280px]">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">WanderMind Headquarters</h3>
                    <p className="text-sm text-muted-foreground">Rajshahi, Bangladesh</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">Open Sunday-Thursday, 10AM-7PM</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-xl gap-1" asChild>
                    <Link href="https://maps.google.com/?q=Rajshahi+Bangladesh" target="_blank">
                      <Globe className="h-3 w-3" />
                      Directions
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Join Our Travel Community</h2>
            <p className="text-muted-foreground mb-6">
              Get exclusive travel tips, early bird offers, and inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="max-w-sm rounded-xl bg-background/50 border-border/50"
              />
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-primary to-primary/80">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}