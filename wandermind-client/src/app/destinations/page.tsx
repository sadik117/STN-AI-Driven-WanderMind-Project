"use client"
import { useEffect, useState } from "react";
import { destinationService } from "@/services";
import { DestinationCard } from "@/components/shared/DestinationCard";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    destinationService.getDestinations().then((data: any) => {
      // Depending on your backend response structure, it might be data.data or data
      setDestinations(data.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Explore Destinations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Discover beautiful places, curated experiences, and AI-powered recommendations for your next adventure.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.length > 0 ? (
            destinations.map((dest: any) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground text-lg py-12">No destinations found. Check back later!</p>
          )}
        </div>
      )}
    </div>
  );
}
