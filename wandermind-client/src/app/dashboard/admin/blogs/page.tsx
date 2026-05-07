'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, FileText, Plus, MoreHorizontal, Edit2, Trash2, Calendar, User } from 'lucide-react';
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

export default function AdminBlogs() {
  const [search, setSearch] = useState('');

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs', search],
    queryFn: async () => {
      const res = await api.get('/blogs', {
        params: { search }
      });
      return res.data;
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Content Management" 
        description="Manage blog posts, travel guides, and articles."
      >
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </DashboardHeader>

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
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
                  <th className="px-6 py-4 text-sm font-semibold">Article</th>
                  <th className="px-6 py-4 text-sm font-semibold">Author</th>
                  <th className="px-6 py-4 text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-64" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : blogs && blogs.length > 0 ? (
                  blogs.map((blog: any) => (
                    <tr key={blog.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg bg-muted overflow-hidden border shadow-sm flex-shrink-0">
                            <img src={blog.coverImage} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm line-clamp-1">{blog.title}</p>
                            <div className="flex gap-1 mt-1">
                              {blog.tags.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{blog.author?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2">
                              <Edit2 className="h-4 w-4" /> Edit Content
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <FileText className="h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 gap-2">
                              <Trash2 className="h-4 w-4" /> Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No blog posts found.
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
