'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Solo Traveler",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      text: "The AI itinerary builder saved me literally days of planning. It knew exactly the mix of culture and food I was looking for in Kyoto. The best trip of my life!",
      rating: 5,
    },
    {
      name: "David & Emily",
      role: "Honeymooners",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=256&auto=format&fit=crop",
      text: "Booking experiences was seamless, and the local host in Santorini was amazing. We loved having everything organized in one dashboard.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Digital Nomad",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      text: "I travel year-round and WanderMind is my go-to. The budget analyzer is incredibly accurate and helps me decide where to go next based on my spending limits.",
      rating: 4.5,
    },
    {
      name: "Jessica Alba",
      role: "Family Traveler",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
      text: "Finding family-friendly activities is tough, but WanderMind's AI suggested the perfect mix of fun for the kids and relaxation for us in Bali.",
      rating: 5,
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Travelers Love WanderMind
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our global community of adventurers has to say.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col border-border/50 bg-card hover:border-primary/20 transition-colors relative">
                      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex gap-1 mb-4">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed italic">
                          "{review.text}"
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                          <img 
                            src={review.image} 
                            alt={review.name} 
                            className="h-10 w-10 rounded-full object-cover border border-border"
                          />
                          <div>
                            <h4 className="font-semibold text-sm">{review.name}</h4>
                            <p className="text-xs text-muted-foreground">{review.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
