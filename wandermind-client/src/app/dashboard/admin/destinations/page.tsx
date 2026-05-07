'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Plus, MoreHorizontal, Edit2, Trash2, Globe } from 'lucide-react';
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

export default function AdminDestinations() {
  const [search, setSearch] = useState('');

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['admin-destinations', search],
    queryFn: async () => {
      const res = await api.get('/destinations', {
        params: { search }
      });
      return res.data;
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Destination Management" 
        description="Add, edit, and manage travel destinations on the platform."
      >
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>
      </DashboardHeader>

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search destinations..." 
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
                  <th className="px-6 py-4 text-sm font-semibold">Destination</th>
                  <th className="px-6 py-4 text-sm font-semibold">Region</th>
                  <th className="px-6 py-4 text-sm font-semibold">Cost/Day</th>
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
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : destinations && destinations.length > 0 ? (
                  destinations.map((dest: any) => (
                    <tr key={dest.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden border shadow-sm">
                            <img src={dest.images[0]} alt="" className="h-full w-full object-cover" />
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
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-full px-3">
                          Published
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
                            <DropdownMenuItem className="gap-2">
                              <Edit2 className="h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Globe className="h-4 w-4" /> View on Site
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 gap-2">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No destinations found.
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
