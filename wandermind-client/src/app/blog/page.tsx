'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight, Search, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-none px-4 py-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Latest Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Travel Insights & Inspiration
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover authentic travel experiences, expert tips, and hidden gems from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-3xl" />
                <div className="space-y-3 px-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-20 text-center bg-gradient-to-br from-destructive/5 to-transparent rounded-3xl border border-destructive/10">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Unable to Load Articles</h3>
              <p className="text-muted-foreground mb-6">There was an error loading the blog posts. Please try again.</p>
              <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : data && data.length > 0 ? (
            data.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 overflow-hidden rounded-3xl hover:shadow-2xl hover:shadow-primary/10 relative">

                    {/* Featured Badge */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg px-3 py-1.5 gap-1.5">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Image Section */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <img
                        src={post.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1170&auto=format&fit=crop'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Tags Overlay */}
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} className="bg-white/90 backdrop-blur-md text-black border-none shadow-lg hover:bg-white transition-all text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {post.readingTime || 5} min read
                        </span>
                      </div>

                      <h3 className="text-xl font-heading font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight mb-3">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                        {post.excerpt || post.content?.substring(0, 120) + '...' || 'Discover amazing travel experiences and tips in this comprehensive guide.'}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between pt-6 mt-4 border-t border-border/30">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                            {post.author?.image ? (
                              <img src={post.author.image} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <span className="text-primary font-bold text-xs">
                                {post.author?.name?.charAt(0) || 'A'}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold">{post.author?.name || 'Travel Writer'}</span>
                        </div>

                        <span className="text-primary font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl" />
                    </div>
                  </Card>
                </Link>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
              <div className="text-6xl mb-4">✍️</div>
              <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">Check back later for new travel stories and guides.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {data && data.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="rounded-full px-8 gap-2 group hover:gap-3 transition-all"
            >
              Load More Articles
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
