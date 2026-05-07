'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    image?: string;
  };
  tags: string[];
  createdAt: string;
  readingTime: string;
}

export default function BlogPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', search],
    queryFn: async () => {
      const res = await api.get('/blogs', {
        params: { search }
      });
      return res.data as BlogPost[];
    },
  });

  return (
    <div className="pb-24">
      {/* Blog Hero */}
      <section className="bg-muted/30 py-20 border-b">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none">
            Travel Stories & Tips
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
            The <span className="text-primary">WanderMind</span> Journal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Insights, inspiration, and practical advice to help you plan your next unforgettable journey.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search articles, tips, destinations..." 
              className="pl-12 h-14 bg-background shadow-lg rounded-2xl border-border/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-3xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-20 text-center bg-destructive/5 rounded-3xl border border-destructive/10">
              <p className="text-destructive font-medium">Failed to load blog posts. Please try again later.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : data && data.length > 0 ? (
            data.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full flex flex-col border-none shadow-none bg-transparent overflow-hidden">
                    <div className="relative h-64 w-full overflow-hidden rounded-3xl mb-6">
                      <img 
                        src={post.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1170&auto=format&fit=crop'} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} className="bg-white/90 text-black border-none backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {post.readingTime || '5 min read'}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-heading font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mb-6 flex-1">
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                    </CardContent>
                    <CardFooter className="p-0 pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden border border-primary/10">
                          {post.author.image ? (
                            <img src={post.author.image} alt={post.author.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                              {post.author.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold">{post.author.name}</span>
                      </div>
                      <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try a different search term or check back later for new content.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
