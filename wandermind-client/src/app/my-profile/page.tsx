'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Globe, 
  Heart, 
  BookOpen, 
  Star, 
  Edit2, 
  Camera, 
  Loader2,
  CheckCircle,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  Compass
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: 'TRAVELER' | 'HOST' | 'ADMIN';
  image?: string;
  createdAt: string;
  _count: {
    bookings: number;
    reviews: number;
    itineraries: number;
  };
  travelerProfile: {
    bio: string | null;
    nationality: string | null;
    travelStyle: string[];
    wishlist: Array<{
      id: string;
      name: string;
      slug: string;
      images: string[];
    }>;
  } | null;
  hostProfile: {
    bio: string | null;
    verified: boolean;
    languages: string[];
    totalEarnings: number;
  } | null;
}

const TRAVEL_STYLES = [
  'Adventure', 'Luxury', 'Budget', 'Cultural', 'Beach', 
  'Nature', 'City', 'Solo', 'Family', 'Romantic', 
  'Backpacking', 'Wellness', 'Foodie', 'Photography'
];

const NATIONALITIES = [
  'American', 'British', 'Canadian', 'Australian', 'Bangladeshi', 'German', 'French', 
  'Italian', 'Spanish', 'Japanese', 'Chinese', 'Indian', 'Brazilian', 
  'Mexican', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 
  'Swiss', 'Austrian', 'Belgian', 'Portuguese', 'Greek', 'Turkish',
  'Russian', 'South Korean', 'Vietnamese', 'Thai', 'Malaysian', 
  'Singaporean', 'Filipino', 'Indonesian', 'Egyptian', 'South African',
  'Nigerian', 'Kenyan', 'Argentinian', 'Chilean', 'Colombian', 'Peruvian'
];
 
const LANGUAGES = [
  'English', 'Bengali', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Hindi', 'Arabic', 'Portuguese', 'Russian', 'Italian', 'Korean', 'Turkish'
];

export default function ProfilePage() {
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/my-profile');
    }
  }, [isAuthenticated, authLoading, router]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res: any = await api.get('/users/profile');
      // The api interceptor already returns res.data, so res is { success, message, data }
      return res.data as ProfileData;
    },
  });

  const user = profile;

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res: any = await api.put('/users/profile', formData);
      return res.data as ProfileData;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      // Update global auth store with the new user data
      if (updatedUser) {
        useAuthStore.getState().updateUser(updatedUser);
      }
      
      toast.success('Profile updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const resetForm = () => {
    setName('');
    setBio('');
    setNationality('');
    setTravelStyle([]);
    setImageFile(null);
    setImagePreview('');
    setLanguages([]);
  };

  const openEditDialog = () => {
    setName(user?.name || '');
    setBio(user?.role === 'HOST' ? user?.hostProfile?.bio || '' : user?.travelerProfile?.bio || '');
    setNationality(user?.travelerProfile?.nationality || '');
    setTravelStyle(user?.travelerProfile?.travelStyle || []);
    setLanguages(user?.hostProfile?.languages || []);
    setImagePreview(user?.image || '');
    setIsEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('nationality', nationality);
    formData.append('travelStyle', JSON.stringify(travelStyle));
    if (user?.role === 'HOST') {
      formData.append('languages', JSON.stringify(languages));
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    updateProfileMutation.mutate(formData);
  };

  const addTravelStyle = (style: string) => {
    if (!travelStyle.includes(style) && travelStyle.length < 8) {
      setTravelStyle([...travelStyle, style]);
    }
  };

  const removeTravelStyle = (style: string) => {
    setTravelStyle(travelStyle.filter(s => s !== style));
  };

  const addLanguage = (lang: string) => {
    if (!languages.includes(lang) && languages.length < 10) {
      setLanguages([...languages, lang]);
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadge = () => {
    switch (user?.role?.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Administrator</Badge>;
      case 'host':
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Host</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Traveler</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <DashboardHeader title="My Profile" description="View and manage your account information" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="h-96 rounded-3xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      <DashboardHeader 
        title="My Profile" 
        description="View and manage your account information"
      >
        <Button onClick={openEditDialog} className="gap-2 rounded-xl">
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="rounded-3xl overflow-hidden border-border/50 sticky top-24">
            <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
            <div className="relative px-6 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-3xl font-bold text-primary">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={openEditDialog}
                    className="absolute bottom-0 right-0 p-1.5 bg-gray-700 rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <h2 className="text-2xl font-heading font-bold mb-1">{user?.name}</h2>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {getRoleBadge()}
                </div>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {user?.createdAt && formatDate(user.createdAt)}
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm font-medium">{user?.createdAt && formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total bookings</span>
                  <span className="text-sm font-medium">{user?._count?.bookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Itineraries</span>
                  <span className="text-sm font-medium">{user?._count?.itineraries || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span className="text-sm font-medium">{user?._count?.reviews || 0}</span>
                </div>
              </div>

              {user?.hostProfile?.verified && (
                <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Verified Host</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
              <TabsTrigger value="wishlist" className="rounded-lg">Wishlist</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-lg">Statistics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Bio */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {user?.role === 'HOST' 
                      ? user?.hostProfile?.bio || 'No host bio added yet. Click edit to share something about yourself!'
                      : user?.travelerProfile?.bio || 'No bio added yet. Click edit to share something about yourself!'}
                  </p>
                </CardContent>
              </Card>

              {/* Travel Preferences */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    Travel Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.travelerProfile?.nationality && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">From: <span className="font-medium">{user.travelerProfile.nationality}</span></span>
                    </div>
                  )}
                  <div>
                    {user?.role === 'TRAVELER' && (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">Travel Style:</p>
                        <div className="flex flex-wrap gap-2">
                          {user?.travelerProfile?.travelStyle?.length ? (
                            user.travelerProfile.travelStyle.map((style) => (
                              <Badge key={style} variant="secondary" className="rounded-full">
                                {style}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No preferences set yet.</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {user?.role === 'HOST' && user?.hostProfile?.languages && user.hostProfile.languages.length > 0 && (
                    <div className="-mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Languages Spoken:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.hostProfile.languages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="rounded-full bg-purple-500/10 text-purple-600 border-purple-500/20">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardContent className="p-4 text-center">
                    <Briefcase className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user?._count?.bookings || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user?.travelerProfile?.wishlist?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Wishlist Items</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user?._count?.itineraries || 0}</p>
                    <p className="text-xs text-muted-foreground">Itineraries</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent">
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user?._count?.reviews || 0}</p>
                    <p className="text-xs text-muted-foreground">Reviews Written</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="mt-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Saved Destinations
                  </CardTitle>
                  <CardDescription>
                    Destinations you've saved for future travels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.travelerProfile?.wishlist?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.travelerProfile.wishlist.map((dest) => (
                        <Link key={dest.id} href={`/destinations/${dest.slug}`}>
                          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                            <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={dest.images[0]} 
                                alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {dest.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">Click to explore →</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No saved destinations yet</p>
                      <Link href="/destinations">
                        <Button variant="link" className="mt-2">
                          Explore Destinations
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="mt-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Travel Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Activity Overview</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bookings</span>
                          <span>{user?._count?.bookings || 0} / 100</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${Math.min(((user?._count?.bookings || 0) / 100) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Itineraries Created</span>
                          <span>{user?._count?.itineraries || 0} / 50</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${Math.min(((user?._count?.itineraries || 0) / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Reviews Written</span>
                          <span>{user?._count?.reviews || 0} / 50</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${Math.min(((user?._count?.reviews || 0) / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Traveler Level</h4>
                    <div className="text-center p-4 bg-muted/20 rounded-xl">
                      <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="font-bold text-lg">
                        {user?._count?.bookings && user._count.bookings >= 10 ? 'Expert Explorer' :
                         user?._count?.bookings && user._count.bookings >= 5 ? 'Seasoned Traveler' :
                         user?._count?.bookings && user._count.bookings >= 1 ? 'Adventurer' : 'New Explorer'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {10 - (user?._count?.bookings || 0)} more bookings to reach next level
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and travel preferences
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={imagePreview || undefined} />
                  <AvatarFallback className="text-3xl font-bold">
                    {name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Camera className="h-3 w-3" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Tell us about yourself..."
                className="rounded-xl min-h-[100px]"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">Share your travel experiences and interests</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Select value={nationality} onValueChange={setNationality}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {NATIONALITIES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Travel Style</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {travelStyle.map((style) => (
                  <Badge key={style} variant="secondary" className="gap-1.5 py-1.5 px-3 rounded-full">
                    {style}
                    <button
                      type="button"
                      onClick={() => removeTravelStyle(style)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addTravelStyle}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Add travel style" />
                </SelectTrigger>
                <SelectContent>
                  {TRAVEL_STYLES.filter(s => !travelStyle.includes(s)).map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select styles that match your travel preferences</p>
            </div>

            {user?.role === 'HOST' && (
              <div className="space-y-3">
                <Label>Languages Spoken</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="gap-1.5 py-1.5 px-3 rounded-full bg-purple-500/10 text-purple-600 border-purple-500/20">
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addLanguage}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Add language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.filter(l => !languages.includes(l)).map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Add languages you can communicate in as a host</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gap-2" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Skeleton component
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted ${className}`} />;
}