'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send, Smile, Heart, Camera, Users, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewFormProps {
  bookingId?: string;
  experienceId?: string;
  destinationId?: string;
  experienceTitle?: string;
  destinationName?: string;
  hostName?: string;
  hostImage?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ 
  bookingId, 
  experienceId, 
  destinationId, 
  experienceTitle,
  destinationName,
  hostName,
  hostImage,
  onSuccess, 
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  const ratingEmojis = {
    1: '😞',
    2: '😐',
    3: '🙂',
    4: '😊',
    5: '🤩'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!content.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/reviews', {
        bookingId,
        experienceId,
        destinationId,
        rating,
        content,
      });
      toast.success('Review submitted successfully!', {
        icon: <Smile className="h-5 w-5" />,
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div className="space-y-6 py-2">
        {/* Experience Info - Responsive Layout */}
        {(experienceTitle || destinationName || hostName) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/30 transition-colors">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-primary/20 shrink-0">
              <AvatarImage src={hostImage} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {hostName?.[0] || 'H'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {experienceTitle && (
                <p className="font-semibold text-sm sm:text-base line-clamp-1">{experienceTitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {destinationName && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    <MapPin className="h-3 w-3" />
                    {destinationName}
                  </div>
                )}
                {hostName && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    <Users className="h-3 w-3" />
                    {hostName}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex rounded-full text-[10px] px-2 py-0">
              Experience
            </Badge>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-4">
            <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              How was your experience?
            </Label>
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="focus:outline-none p-1"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      className={`h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 ${
                        star <= (hover || rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                          : 'text-muted-foreground/30 hover:text-muted-foreground/50'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              
              {/* Rating Label with Animation */}
              <AnimatePresence mode="wait">
                {(hover || rating) > 0 && (
                  <motion.div
                    key={hover || rating}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
                  >
                    <span className="text-xl sm:text-2xl">
                      {ratingEmojis[(hover || rating) as keyof typeof ratingEmojis]}
                    </span>
                    <span className="font-bold text-primary text-sm sm:text-base">
                      {ratingLabels[(hover || rating) as keyof typeof ratingLabels]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Review Text Section */}
          <div className="space-y-3">
            <Label htmlFor="review" className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Your Review
            </Label>
            <div className={`relative transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/20 rounded-2xl' : ''}`}>
              <Textarea
                id="review"
                rows={5}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm resize-none transition-all text-sm sm:text-base"
                placeholder="What did you love about this experience? Share the highlights and tips for future travelers..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border">
                {content.length} characters
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 sm:h-12 gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 font-bold"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-11 sm:h-12 rounded-xl border-border/50 hover:bg-muted/50"
              >
                Maybe Later
              </Button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}