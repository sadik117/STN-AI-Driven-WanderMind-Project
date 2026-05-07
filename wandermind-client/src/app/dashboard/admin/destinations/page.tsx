'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Plus, MoreHorizontal, Edit2, Trash2, Globe, Loader2, X, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/shared/ImageUpload';
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

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: string;
  description: string;
  images: string[];
  tags: string[];
  avgCostPerDay: number;
  rating: number;
  reviewCount: number;
  climate: string;
  bestMonths: string[];
  latitude: number;
  longitude: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Predefined suggestions for tags and best months
const SUGGESTED_TAGS = [
  'culture', 'nature', 'food', 'adventure', 'beach', 'history', 
  'shopping', 'nightlife', 'family', 'luxury', 'budget', 'romantic',
  'spiritual', 'wildlife', 'architecture', 'festivals', 'photography'
];

const SUGGESTED_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AdminDestinations() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [description, setDescription] = useState('');
  const [avgCostPerDay, setAvgCostPerDay] = useState('');
  const [climate, setClimate] = useState('');
  const [bestMonths, setBestMonths] = useState<string[]>([]);
  const [monthInput, setMonthInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);

  const { data: destinations, isLoading, refetch } = useQuery({
    queryKey: ['admin-destinations', search],
    queryFn: async () => {
      const res = await api.get('/destinations', {
        params: { search, limit: 100 }
      });
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const response = await api.post('/destinations', newData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      toast.success('Destination created successfully');
      setIsCreateOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create destination');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/destinations/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      toast.success('Destination updated successfully');
      setIsEditOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update destination');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/destinations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      toast.success('Destination deleted successfully');
      setIsDeleteOpen(false);
      setSelectedDestination(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete destination');
    }
  });

  const resetForm = () => {
    setName('');
    setSlug('');
    setCountry('');
    setContinent('');
    setDescription('');
    setAvgCostPerDay('');
    setClimate('');
    setBestMonths([]);
    setMonthInput('');
    setTags([]);
    setTagInput('');
    setLatitude('');
    setLongitude('');
    setImages([]);
    setFeatured(false);
    setSelectedDestination(null);
  };

  const populateEditForm = (destination: Destination) => {
    setSelectedDestination(destination);
    setName(destination.name);
    setSlug(destination.slug);
    setCountry(destination.country);
    setContinent(destination.continent);
    setDescription(destination.description);
    setAvgCostPerDay(destination.avgCostPerDay.toString());
    setClimate(destination.climate);
    setBestMonths(destination.bestMonths || []);
    setTags(destination.tags || []);
    setLatitude(destination.latitude?.toString() || '');
    setLongitude(destination.longitude?.toString() || '');
    setImages(destination.images);
    setFeatured(destination.featured);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    createMutation.mutate({
      name,
      slug,
      country,
      continent,
      description,
      avgCostPerDay: parseFloat(avgCostPerDay),
      climate,
      bestMonths,
      tags,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      images,
      featured,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestination) return;
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    updateMutation.mutate({
      id: selectedDestination.id,
      data: {
        name,
        slug,
        country,
        continent,
        description,
        avgCostPerDay: parseFloat(avgCostPerDay),
        climate,
        bestMonths,
        tags,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images,
        featured,
      }
    });
  };

  // Tag management functions
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Month management functions
  const addMonth = () => {
    if (monthInput && !bestMonths.includes(monthInput)) {
      setBestMonths([...bestMonths, monthInput]);
      setMonthInput('');
    }
  };

  const removeMonth = (month: string) => {
    setBestMonths(bestMonths.filter(m => m !== month));
  };

  const addSuggestedMonth = (month: string) => {
    if (!bestMonths.includes(month)) {
      setBestMonths([...bestMonths, month]);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Destination Management" 
        description="Add, edit, and manage travel destinations on the platform."
      >
        <Button 
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }} 
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>
      </DashboardHeader>

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between gap-4 flex-wrap">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search destinations..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {destinations?.length || 0} destinations
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-4 text-sm font-semibold">Destination</th>
                  <th className="px-6 py-4 text-sm font-semibold">Region</th>
                  <th className="px-6 py-4 text-sm font-semibold">Cost/Day</th>
                  <th className="px-6 py-4 text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-sm font-semibold">Tags</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : destinations && destinations.length > 0 ? (
                  destinations.map((dest: Destination) => (
                    <tr key={dest.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden border shadow-sm flex-shrink-0">
                            {dest.images[0] && (
                              <img src={dest.images[0]} alt={dest.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{dest.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {dest.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="rounded-full gap-1.5 py-0.5">
                          <Globe className="h-3 w-3 text-primary" />
                          {dest.continent}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        ${dest.avgCostPerDay}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">★</span>
                          <span className="text-sm">{dest.rating?.toFixed(1) || '0.0'}</span>
                          <span className="text-xs text-muted-foreground">({dest.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {dest.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                              {tag}
                            </Badge>
                          ))}
                          {dest.tags?.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{dest.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={dest.featured ? "bg-amber-500/10 text-amber-500 border-none rounded-full px-3" : "bg-emerald-500/10 text-emerald-500 border-none rounded-full px-3"}>
                          {dest.featured ? 'Featured' : 'Published'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Management</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => populateEditForm(dest)}
                            >
                              <Edit2 className="h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => window.open(`/destinations/${dest.slug}`, '_blank')}
                            >
                              <Globe className="h-4 w-4" /> View on Site
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/10 gap-2"
                              onClick={() => {
                                setSelectedDestination(dest);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No destinations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Destination Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">New Destination</DialogTitle>
            <DialogDescription>
              Create a new travel destination. Fill in all the required details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Paris" 
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input 
                  id="slug" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="e.g. paris-france" 
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input 
                  id="country" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  placeholder="e.g. France" 
                  required 
                  className="rounded-xl" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="continent">Continent *</Label>
                <Input 
                  id="continent" 
                  value={continent} 
                  onChange={(e) => setContinent(e.target.value)} 
                  placeholder="e.g. Europe" 
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="climate">Climate *</Label>
                <Input 
                  id="climate" 
                  value={climate} 
                  onChange={(e) => setClimate(e.target.value)} 
                  placeholder="e.g. Temperate" 
                  required 
                  className="rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Average Cost Per Day ($) *</Label>
              <Input 
                id="cost" 
                type="number" 
                step="1"
                value={avgCostPerDay} 
                onChange={(e) => setAvgCostPerDay(e.target.value)} 
                placeholder="e.g. 150" 
                required 
                className="rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Tell us about this place..." 
                required 
                className="rounded-xl min-h-[100px]" 
              />
            </div>

            {/* Best Months Section */}
            <div className="space-y-3">
              <Label>Best Months to Visit</Label>
              <div className="flex gap-2">
                <Input 
                  value={monthInput} 
                  onChange={(e) => setMonthInput(e.target.value)} 
                  placeholder="Type a month and click Add" 
                  className="rounded-xl flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMonth())}
                  list="months-suggestions"
                />
                <Button type="button" onClick={addMonth} variant="outline" className="rounded-xl">
                  Add Month
                </Button>
              </div>
              <datalist id="months-suggestions">
                {SUGGESTED_MONTHS.map(month => (
                  <option key={month} value={month} />
                ))}
              </datalist>
              
              {/* Selected Months with remove buttons */}
              {bestMonths.length > 0 && (
                <div className="border rounded-xl p-3 bg-muted/20">
                  <Label className="text-xs text-muted-foreground mb-2 block">Selected Months:</Label>
                  <div className="flex flex-wrap gap-2">
                    {bestMonths.map((month) => (
                      <Badge key={month} variant="secondary" className="gap-1.5 py-1.5 px-3">
                        {month}
                        <button
                          type="button"
                          onClick={() => removeMonth(month)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested quick-add months */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-muted-foreground mr-1">Quick add:</span>
                {SUGGESTED_MONTHS.filter(m => !bestMonths.includes(m)).slice(0, 6).map(month => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => addSuggestedMonth(month)}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <Label>Tags / Interests</Label>
              <div className="flex gap-2">
                <Input 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  placeholder="e.g., culture, food, adventure" 
                  className="rounded-xl flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  list="tags-suggestions"
                />
                <Button type="button" onClick={addTag} variant="outline" className="rounded-xl">
                  <Hash className="h-4 w-4 mr-1" /> Add Tag
                </Button>
              </div>
              <datalist id="tags-suggestions">
                {SUGGESTED_TAGS.map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>

              {/* Selected Tags with remove buttons */}
              {tags.length > 0 && (
                <div className="border rounded-xl p-3 bg-muted/20">
                  <Label className="text-xs text-muted-foreground mb-2 block">Selected Tags:</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1.5 py-1.5 px-3">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested quick-add tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-muted-foreground mr-1">Popular tags:</span>
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addSuggestedTag(tag)}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude (Optional)</Label>
                <Input 
                  type="number" 
                  step="any"
                  value={latitude} 
                  onChange={(e) => setLatitude(e.target.value)} 
                  placeholder="e.g. 48.8566" 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude (Optional)</Label>
                <Input 
                  type="number" 
                  step="any"
                  value={longitude} 
                  onChange={(e) => setLongitude(e.target.value)} 
                  placeholder="e.g. 2.3522" 
                  className="rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Destination Images *</Label>
              <ImageUpload 
                onUpload={(url) => setImages((prev) => [...prev, url])} 
                label="Upload at least one hero image" 
              />
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative h-20 w-28 rounded-lg overflow-hidden border group">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured" className="text-sm cursor-pointer">Feature this destination (shows on homepage)</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gap-2" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Destination
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog - Same structure as create but with edit mutation */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Edit Destination</DialogTitle>
            <DialogDescription>
              Update the destination details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input 
                  id="edit-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country *</Label>
                <Input 
                  id="edit-country" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  required 
                  className="rounded-xl" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-continent">Continent *</Label>
                <Input 
                  id="edit-continent" 
                  value={continent} 
                  onChange={(e) => setContinent(e.target.value)} 
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-climate">Climate *</Label>
                <Input 
                  id="edit-climate" 
                  value={climate} 
                  onChange={(e) => setClimate(e.target.value)} 
                  required 
                  className="rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cost">Average Cost Per Day ($) *</Label>
              <Input 
                id="edit-cost" 
                type="number" 
                step="1"
                value={avgCostPerDay} 
                onChange={(e) => setAvgCostPerDay(e.target.value)} 
                required 
                className="rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea 
                id="edit-description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                className="rounded-xl min-h-[100px]" 
              />
            </div>

            {/* Best Months */}
            <div className="space-y-3">
              <Label>Best Months to Visit</Label>
              <div className="flex gap-2">
                <Input 
                  value={monthInput} 
                  onChange={(e) => setMonthInput(e.target.value)} 
                  placeholder="Type a month and click Add" 
                  className="rounded-xl flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMonth())}
                />
                <Button type="button" onClick={addMonth} variant="outline" className="rounded-xl">
                  Add Month
                </Button>
              </div>
              
              {bestMonths.length > 0 && (
                <div className="border rounded-xl p-3 bg-muted/20">
                  <Label className="text-xs text-muted-foreground mb-2 block">Selected Months:</Label>
                  <div className="flex flex-wrap gap-2">
                    {bestMonths.map((month) => (
                      <Badge key={month} variant="secondary" className="gap-1.5 py-1.5 px-3">
                        {month}
                        <button type="button" onClick={() => removeMonth(month)} className="ml-1 hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags / Interests</Label>
              <div className="flex gap-2">
                <Input 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  placeholder="e.g., culture, food, adventure" 
                  className="rounded-xl flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" className="rounded-xl">
                  <Hash className="h-4 w-4 mr-1" /> Add Tag
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="border rounded-xl p-3 bg-muted/20">
                  <Label className="text-xs text-muted-foreground mb-2 block">Selected Tags:</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1.5 py-1.5 px-3">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Destination Images *</Label>
              <ImageUpload onUpload={(url) => setImages([...images, url])} label="Upload more images" />
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative h-20 w-28 rounded-lg overflow-hidden border group">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="edit-featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-gray-300" />
              <Label htmlFor="edit-featured" className="text-sm cursor-pointer">Feature this destination</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gap-2" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Destination
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the destination "{selectedDestination?.name}". 
              This action cannot be undone and will also remove all associated experiences, itineraries, and reviews.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedDestination && deleteMutation.mutate(selectedDestination.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Destination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}