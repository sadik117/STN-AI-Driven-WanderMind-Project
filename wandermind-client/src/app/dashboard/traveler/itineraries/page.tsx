'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Calendar, 
  Clock, 
  Share2, 
  Trash2, 
  Plus, 
  Sparkles, 
  MapPin, 
  DollarSign,
  Eye,
  Download,
  Copy,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Itinerary {
  id: string;
  title: string;
  days: number;
  budget: number | null;
  travelStyle: string;
  planJson: any;
  aiGenerated: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  destination: {
    id: string;
    name: string;
    country: string;
    images: string[];
  } | null;
}

export default function TravelerItineraries() {
  const queryClient = useQueryClient();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: itineraries, isLoading, error, refetch } = useQuery({
    queryKey: ['my-itineraries'],
    queryFn: async () => {
      const res = await api.get('/itineraries/my');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/itineraries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-itineraries'] });
      toast.success('Itinerary deleted successfully');
      setIsDeleteOpen(false);
      setSelectedItinerary(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete itinerary');
    }
  });

  const updatePublicStatusMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const res = await api.patch(`/itineraries/${id}`, { isPublic });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-itineraries'] });
      toast.success('Itinerary visibility updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update itinerary');
    }
  });

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const viewItinerary = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setIsViewOpen(true);
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTravelStyleIcon = (style: string) => {
    switch (style?.toLowerCase()) {
      case 'luxury': return '💎';
      case 'budget': return '💰';
      case 'adventure': return '🏔️';
      case 'relaxation': return '🧘';
      case 'cultural': return '🏛️';
      default: return '✈️';
    }
  };

  if (error) {
    return (
      <div className="space-y-8">
        <DashboardHeader 
          title="My Itineraries" 
          description="View and manage your AI-generated travel plans."
        >
          <Link href="/ai-planner">
            <Button className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Plan New Trip
            </Button>
          </Link>
        </DashboardHeader>
        <Card className="rounded-3xl">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Itineraries</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your itineraries. Please try again.
            </p>
            <Button onClick={() => refetch()} className="rounded-xl">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="My Itineraries" 
        description="View and manage your AI-generated travel plans."
      >
        <Link href="/ai-planner">
          <Button className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-3xl" />
          ))
        ) : itineraries && itineraries.length > 0 ? (
          itineraries.map((itinerary: Itinerary) => (
            <Card 
              key={itinerary.id} 
              className="group overflow-hidden rounded-3xl border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 bg-card flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={itinerary.destination?.images?.[0] || `https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80`} 
                  alt={itinerary.destination?.name || itinerary.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-1 text-xs font-medium bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                      <Calendar className="h-3 w-3" />
                      {formatDate(itinerary.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary/80 backdrop-blur-md border-none text-white text-xs">
                        {itinerary.days} {itinerary.days === 1 ? 'Day' : 'Days'}
                      </Badge>
                      {itinerary.aiGenerated && (
                        <Badge className="bg-purple-500/80 backdrop-blur-md border-none text-white text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-xl font-bold font-heading mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" /> 
                    <span className="truncate">{itinerary.destination?.name || itinerary.title}</span>
                  </h3>
                  {itinerary.destination?.country && (
                    <p className="text-xs text-muted-foreground">{itinerary.destination.country}</p>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {itinerary.title || 'Custom generated travel plan for you.'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="rounded-full text-xs gap-1">
                    {getTravelStyleIcon(itinerary.travelStyle)} {itinerary.travelStyle || 'Balanced'}
                  </Badge>
                  {itinerary.budget && (
                    <Badge variant="outline" className="rounded-full text-xs gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatBudget(itinerary.budget)}
                    </Badge>
                  )}
                  {itinerary.isPublic && (
                    <Badge variant="secondary" className="rounded-full text-xs">
                      Public
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-primary/10"
                      onClick={() => copyToClipboard(`${window.location.origin}/itineraries/${itinerary.id}`, itinerary.id)}
                    >
                      {copiedId === itinerary.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedItinerary(itinerary);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-xl gap-2 font-bold group/btn"
                    onClick={() => viewItinerary(itinerary)}
                  >
                    <Eye className="h-3 w-3" />
                    View Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
            <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No itineraries found</h3>
            <p className="text-muted-foreground mb-6">Let our AI build the perfect trip for you.</p>
            <Link href="/ai-planner">
              <Button className="gap-2 rounded-xl">
                <Sparkles className="h-4 w-4" />
                Start Planning
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* View Itinerary Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">
              {selectedItinerary?.destination?.name || selectedItinerary?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedItinerary?.days} {selectedItinerary?.days === 1 ? 'Day' : 'Days'} • {selectedItinerary?.travelStyle} Style
            </DialogDescription>
          </DialogHeader>
          
          {selectedItinerary && (
            <div className="space-y-6">
              {/* Overview Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-xl">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">{selectedItinerary.days} days</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-xl">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-semibold">{formatBudget(selectedItinerary.budget)}</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-xl">
                  <Sparkles className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Style</p>
                  <p className="font-semibold">{selectedItinerary.travelStyle}</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-xl">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-semibold text-sm">{formatDate(selectedItinerary.createdAt)}</p>
                </div>
              </div>

              {/* Itinerary Content */}
              {selectedItinerary.planJson && (
                <div className="space-y-6">
                  {typeof selectedItinerary.planJson === 'object' && (
                    <>
                      {/* Title and Summary */}
                      {selectedItinerary.planJson.title && (
                        <div>
                          <h3 className="text-xl font-bold mb-2">{selectedItinerary.planJson.title}</h3>
                          <p className="text-muted-foreground">{selectedItinerary.planJson.summary}</p>
                          {selectedItinerary.planJson.totalEstimatedCost && (
                            <p className="text-sm font-semibold mt-2 text-primary">
                              Estimated Total: ${selectedItinerary.planJson.totalEstimatedCost}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Daily Plan */}
                      {selectedItinerary.planJson.days && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold">Daily Itinerary</h3>
                          {selectedItinerary.planJson.days.map((day: any, idx: number) => (
                            <Card key={idx} className="rounded-2xl overflow-hidden">
                              <div className="bg-primary/5 px-4 py-3 border-b">
                                <h4 className="font-bold">Day {day.day}: {day.theme}</h4>
                              </div>
                              <div className="p-4 space-y-3">
                                {day.activities?.map((activity: any, actIdx: number) => (
                                  <div key={actIdx} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                                    <div className="flex-shrink-0 w-16 text-right">
                                      <span className="font-mono text-xs font-semibold text-primary">{activity.time}</span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-sm">{activity.place}</p>
                                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                                        <span>⏱️ {activity.duration}</span>
                                        <span>💰 ${activity.estimatedCost}</span>
                                        {activity.tip && <span>💡 {activity.tip}</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Packing Tips */}
                      {selectedItinerary.planJson.packingTips && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Packing Tips</h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedItinerary.planJson.packingTips.map((tip: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-primary">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Local Phrases */}
                      {selectedItinerary.planJson.localPhrases && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Local Phrases</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedItinerary.planJson.localPhrases.map((phrase: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="font-medium">{phrase.phrase}</span>
                                <span className="text-sm text-muted-foreground">{phrase.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* If planJson is a string */}
                  {typeof selectedItinerary.planJson === 'string' && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{selectedItinerary.planJson}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsViewOpen(false)} className="rounded-xl">
              Close
            </Button>
            <Link href={`/ai-planner?edit=${selectedItinerary?.id}`}>
              <Button className="rounded-xl gap-2">
                <Sparkles className="h-4 w-4" />
                Regenerate with AI
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedItinerary?.destination?.name || selectedItinerary?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedItinerary && deleteMutation.mutate(selectedItinerary.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Itinerary
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 