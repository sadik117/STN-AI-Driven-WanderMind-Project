'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  MapPin, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Users, 
  Star, 
  DollarSign,
  Clock,
  Loader2,
  X,
  Globe,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ImageUpload } from '@/components/shared/ImageUpload';
import Link from 'next/link';

interface Experience {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  duration: string;
  category: string;
  maxGuests: number;
  location: string;
  destinationId: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  destination: {
    name: string;
    country: string;
  };
}

const CATEGORIES = [
  'Adventure', 'Cultural', 'Food', 'Nature', 'Wellness', 
  'Sightseeing', 'Workshop', 'Nightlife', 'Family', 'Luxury'
];

export default function HostExperiences() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [location, setLocation] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);

  const { data: experiences, isLoading, error, refetch } = useQuery({
    queryKey: ['host-experiences', search],
    queryFn: async () => {
      const res = await api.get('/experiences/my-experiences', {
        params: { search: search || undefined }
      });
      return res.data;
    }
  });

  const { data: destinations } = useQuery({
    queryKey: ['destinations-list'],
    queryFn: async () => {
      const res = await api.get('/destinations', { params: { limit: 100 } });
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/experiences', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-experiences'] });
      toast.success('Experience created successfully');
      setIsCreateOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create experience');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/experiences/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-experiences'] });
      toast.success('Experience updated successfully');
      setIsEditOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update experience');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-experiences'] });
      toast.success('Experience deleted successfully');
      setIsDeleteOpen(false);
      setSelectedExperience(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete experience');
    }
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration('');
    setCategory('');
    setMaxGuests('');
    setLocation('');
    setDestinationId('');
    setImages([]);
    setFeatured(false);
    setSelectedExperience(null);
  };

  const populateEditForm = (experience: Experience) => {
    setSelectedExperience(experience);
    setTitle(experience.title);
    setDescription(experience.description);
    setPrice(experience.price.toString());
    setDuration(experience.duration);
    setCategory(experience.category);
    setMaxGuests(experience.maxGuests.toString());
    setLocation(experience.location);
    setDestinationId(experience.destinationId);
    setImages(experience.images);
    setFeatured(experience.featured);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    createMutation.mutate({
      title,
      description,
      price: parseFloat(price),
      duration,
      category,
      maxGuests: parseInt(maxGuests),
      location,
      destinationId,
      images,
      featured,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExperience) return;
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    updateMutation.mutate({
      id: selectedExperience.id,
      data: {
        title,
        description,
        price: parseFloat(price),
        duration,
        category,
        maxGuests: parseInt(maxGuests),
        location,
        destinationId,
        images,
        featured,
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Adventure': 'bg-orange-500/10 text-orange-500',
      'Cultural': 'bg-purple-500/10 text-purple-500',
      'Food': 'bg-red-500/10 text-red-500',
      'Nature': 'bg-green-500/10 text-green-500',
      'Wellness': 'bg-blue-500/10 text-blue-500',
      'Sightseeing': 'bg-cyan-500/10 text-cyan-500',
      'Workshop': 'bg-pink-500/10 text-pink-500',
      'Nightlife': 'bg-indigo-500/10 text-indigo-500',
      'Family': 'bg-yellow-500/10 text-yellow-500',
      'Luxury': 'bg-amber-500/10 text-amber-500',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  };

  if (error) {
    return (
      <div className="space-y-8">
        <DashboardHeader 
          title="My Experiences" 
          description="Manage the travel experiences you host."
        >
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            New Experience
          </Button>
        </DashboardHeader>
        <Card className="rounded-3xl">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Experiences</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your experiences. Please try again.
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
        title="My Experiences" 
        description="Manage the travel experiences you host."
      >
        <Button onClick={() => {
          resetForm();
          setIsCreateOpen(true);
        }} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          New Experience
        </Button>
      </DashboardHeader>

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between gap-4 flex-wrap">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search your experiences..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {experiences?.length || 0} experiences
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-4 text-sm font-semibold">Experience</th>
                  <th className="px-6 py-4 text-sm font-semibold">Location</th>
                  <th className="px-6 py-4 text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold">Duration</th>
                  <th className="px-6 py-4 text-sm font-semibold">Max Guests</th>
                  <th className="px-6 py-4 text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : experiences && experiences.length > 0 ? (
                  experiences.map((exp: Experience) => (
                    <tr key={exp.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg bg-muted overflow-hidden border shadow-sm flex-shrink-0">
                            {exp.images[0] && (
                              <img src={exp.images[0]} alt={exp.title} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm line-clamp-1">{exp.title}</p>
                            <Badge className={`${getCategoryColor(exp.category)} rounded-full text-[10px] px-2 py-0 border-none`}>
                              {exp.category}
                            </Badge>
                            {exp.featured && (
                              <Badge className="bg-amber-500/10 text-amber-500 rounded-full text-[10px] px-2 py-0 ml-1">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {exp.location}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{exp.destination?.name}, {exp.destination?.country}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        {formatCurrency(exp.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {exp.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {exp.maxGuests}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          {exp.rating.toFixed(1)}
                          <span className="text-xs text-muted-foreground">({exp.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Manage</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => populateEditForm(exp)} className="gap-2">
                              <Edit2 className="h-4 w-4" /> Edit Experience
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedExperience(exp);
                                setIsBookingsOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Calendar className="h-4 w-4" /> View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => window.open(`/experiences/${exp.id}`, '_blank')}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedExperience(exp);
                                setIsDeleteOpen(true);
                              }}
                              className="text-destructive focus:bg-destructive/10 gap-2"
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
                      <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      You haven't listed any experiences yet.
                      <div className="mt-4">
                        <Button onClick={() => {
                          resetForm();
                          setIsCreateOpen(true);
                        }} variant="outline" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create Your First Experience
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Experience Dialog */}
      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setIsEditOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">
              {isCreateOpen ? 'Create New Experience' : 'Edit Experience'}
            </DialogTitle>
            <DialogDescription>
              {isCreateOpen ? 'List a new travel experience for travelers to book.' : 'Update your experience details.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Experience Title *</Label>
              <Input 
                id="title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Sunset Sailing Adventure"
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
                placeholder="Describe what travelers will experience..."
                required 
                className="rounded-xl min-h-[120px]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input 
                  id="price"
                  type="number"
                  step="0.01"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="99.99"
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input 
                  id="duration"
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  placeholder="e.g., 2 hours, Full day"
                  required 
                  className="rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max Guests *</Label>
                <Input 
                  id="maxGuests"
                  type="number"
                  value={maxGuests} 
                  onChange={(e) => setMaxGuests(e.target.value)} 
                  placeholder="10"
                  required 
                  className="rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location"
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="e.g., Downtown, Beach Area"
                  required 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Select value={destinationId} onValueChange={setDestinationId} required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(destinations) && destinations.map((dest: any) => (
                      <SelectItem key={dest.id} value={dest.id}>
                        {dest.name}, {dest.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Experience Images *</Label>
              <ImageUpload 
                onUpload={(url) => setImages([...images, url])} 
                label="" 
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
              <Label htmlFor="featured" className="text-sm cursor-pointer">
                Feature this experience
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsCreateOpen(false);
                setIsEditOpen(false);
                resetForm();
              }} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gap-2" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                {isCreateOpen ? 'Create Experience' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedExperience?.title}". 
              This action cannot be undone and will also cancel any pending bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedExperience && deleteMutation.mutate(selectedExperience.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Experience
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bookings Dialog */}
      <Dialog open={isBookingsOpen} onOpenChange={setIsBookingsOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Bookings</DialogTitle>
            <DialogDescription>
              Recent bookings for "{selectedExperience?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <p className="text-muted-foreground">No bookings yet for this experience.</p>
              <p className="text-sm text-muted-foreground mt-1">When travelers book, they'll appear here.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBookingsOpen(false)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}