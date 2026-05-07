'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Bookmark,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function BlogPostDetail() {
  const { slug } = useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <Skeleton className="h-[400px] w-full rounded-3xl mb-12" />
        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link href="/blog">
          <Button>Back to Journal</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-24">
      {/* Blog Post Header */}
      <header className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-none">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                {post.author.image ? (
                  <img src={post.author.image} alt={post.author.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <p className="font-bold text-foreground">{post.author.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime || '6 min read'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="container mx-auto px-4 max-w-5xl -mt-12 mb-16">
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={post.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1170&auto=format&fit=crop'} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg prose-primary max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Post Footer */}
        <div className="mt-16 pt-12 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-muted/30 p-8 rounded-3xl">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="h-16 w-16 rounded-full bg-primary/10 overflow-hidden">
                {post.author.image ? (
                  <img src={post.author.image} alt={post.author.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-2xl text-primary">
                    {post.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Written by</p>
                <h4 className="text-xl font-bold">{post.author.name}</h4>
                <p className="text-muted-foreground text-sm mt-1">Travel writer & adventurer based in {post.author.location || 'somewhere beautiful'}.</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center">
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 font-bold group">
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Previous Article
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 font-bold group">
                Next Article
                <Share2 className="h-4 w-4 group-hover:translate-x-1 transition-transform rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
