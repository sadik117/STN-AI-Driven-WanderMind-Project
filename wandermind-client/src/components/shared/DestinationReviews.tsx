'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/useAuthStore';
import ReviewForm from './ReviewForm';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function DestinationReviews({ destinationId }: { destinationId: string }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', 'destination', destinationId],
    queryFn: async () => {
      const res = await api.get(`/reviews?destinationId=${destinationId}`);
      return res.data;
    }
  });

  const reviews = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-heading">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        {isAuthenticated && !showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Star className="h-4 w-4" /> Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-12">
          <ReviewForm 
            destinationId={destinationId} 
            onSuccess={() => {
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ['reviews', 'destination', destinationId] });
              queryClient.invalidateQueries({ queryKey: ['destination'] });
            }} 
          />
          <Button variant="ghost" onClick={() => setShowForm(false)} className="mt-4 w-full text-muted-foreground">
            Cancel
          </Button>
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review: any) => (
            <div key={review.id} className="flex gap-4 md:gap-6 border-b border-border/30 pb-8 last:border-0">
              <Avatar className="h-12 w-12 border shadow-sm shrink-0">
                <AvatarImage src={review.author.image} />
                <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{review.author.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-muted/20 rounded-3xl border border-dashed">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h4 className="font-bold mb-1">No reviews yet</h4>
          <p className="text-muted-foreground text-sm">Be the first to share your thoughts about this destination.</p>
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <AlertCircle className="h-5 w-5 text-primary" />
          <p className="text-sm">
            Please <Link href="/login" className="font-bold underline">log in</Link> to write a review.
          </p>
        </div>
      )}
    </div>
  );
}
