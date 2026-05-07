'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Plus, MoreHorizontal, Edit2, Trash2, Users, Star } from 'lucide-react';
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

export default function HostExperiences() {
  const [search, setSearch] = useState('');

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['host-experiences', search],
    queryFn: async () => {
      const res = await api.get('/experiences/my-experiences');
      return res.data;
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="My Experiences" 
        description="Manage the travel experiences you host."
      >
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          New Experience
        </Button>
      </DashboardHeader>

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search your experiences..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-4 text-sm font-semibold">Experience</th>
                  <th className="px-6 py-4 text-sm font-semibold">Location</th>
                  <th className="px-6 py-4 text-sm font-semibold">Price</th>
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
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : experiences && experiences.length > 0 ? (
                  experiences.map((exp: any) => (
                    <tr key={exp.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg bg-muted overflow-hidden border shadow-sm">
                            <img src={exp.images[0]} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm line-clamp-1">{exp.title}</p>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-none bg-primary/10 text-primary">
                              {exp.category}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {exp.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        ${exp.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          {exp.rating}
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
                            <DropdownMenuItem className="gap-2">
                              <Edit2 className="h-4 w-4" /> Edit Experience
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Users className="h-4 w-4" /> View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 gap-2">
                              <Trash2 className="h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      You haven't listed any experiences yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
