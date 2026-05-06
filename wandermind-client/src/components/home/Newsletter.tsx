'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Get Weekly Wanderlust
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join our community of travelers. Receive exclusive destination guides, AI travel tips, and early access to unique experiences directly in your inbox.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
              required
            />
            <Button type="submit" size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-white">
              Subscribe
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-white/50 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
