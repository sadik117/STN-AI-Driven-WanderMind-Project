import Link from 'next/link';
import { Map, Globe, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Map className="h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                WanderMind
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your AI-powered travel companion. Discover destinations, plan personalized itineraries, and book unforgettable experiences.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/destinations" className="text-sm text-muted-foreground hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link href="/experiences" className="text-sm text-muted-foreground hover:text-primary transition-colors">Experiences</Link></li>
              <li><Link href="/plan" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Trip Planner</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Travel Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Hosts</h3>
            <ul className="space-y-3">
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Become a Host</Link></li>
              <li><Link href="/dashboard/host" className="text-sm text-muted-foreground hover:text-primary transition-colors">Host Dashboard</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Host Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help & FAQ</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WanderMind. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
