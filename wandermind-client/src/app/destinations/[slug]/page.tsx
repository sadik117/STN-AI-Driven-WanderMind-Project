"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { destinationService } from "@/services";
import { MapPin, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DestinationDetailsPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      destinationService.getBySlug(slug as string).then((data: any) => {
        setDestination(data.data);
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  
  if (!destination) return <div className="text-center p-20 text-2xl font-heading">Destination not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Image */}
      <div className="h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden mb-12 relative shadow-lg">
        <img 
          src={destination.images?.[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080'} 
          alt={destination.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="flex items-center gap-2 text-white/90 mb-3 text-lg font-medium">
            <MapPin className="h-5 w-5 text-primary" />
            {destination.country}, {destination.continent}
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4">{destination.name}</h1>
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{destination.rating?.toFixed(1) || "5.0"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4 font-heading">Overview</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {destination.description || "Discover the wonders of this amazing destination. From cultural landmarks to culinary delights, there's something for everyone to enjoy."}
            </p>
          </section>

          {/* Tags */}
          {destination.tags && destination.tags.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-3">Great for</h3>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag: string) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-2xl mb-6 font-heading">Plan Your Trip</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/> Avg Cost</span> 
                <span className="font-bold text-lg">${destination.avgCostPerDay}/day</span>
              </div>
            </div>

            <Button className="w-full text-lg h-12 mb-3">Book Experience</Button>
            <Button variant="outline" className="w-full text-lg h-12">Generate AI Itinerary</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
