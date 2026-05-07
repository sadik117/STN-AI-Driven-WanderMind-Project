'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  Loader2,
  Filter,
  Calendar,
  Clock,
  Hash,
  Globe,
  X,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  aiAssisted: boolean;
  published: boolean;
  readingTime: number;
  authorId: string;
  author: {
    name: string;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

const SUGGESTED_TAGS = [
  'Travel Tips', 'Destinations', 'Culture', 'Food', 'Adventure',
  'Luxury Travel', 'Budget Travel', 'Solo Travel', 'Family Travel',
  'Sustainable Travel', 'Photography', 'Wellness', 'Beaches', 'Mountains'
];

export default function AdminBlogs() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('write');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [aiAssisted, setAiAssisted] = useState(false);
  const [published, setPublished] = useState(false);
  const [readingTime, setReadingTime] = useState(5);

  const { data: blogsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-blogs', search, statusFilter],
    queryFn: async () => {
      const res = await api.get('/admin/blogs', {
        params: { 
          search: search || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          limit: 100
        }
      });
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/blogs', formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog post created successfully');
      setIsCreateOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create blog post');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await api.put(`/blogs/${id}`, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog post updated successfully');
      setIsEditOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const res = await api.put(`/blogs/${id}`, { published });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success(`Blog post ${data.published ? 'published' : 'unpublished'} successfully`);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update blog status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog post deleted successfully');
      setIsDeleteOpen(false);
      setSelectedBlog(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog post');
    }
  });

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCoverImageFile(null);
    setCoverImagePreview('');
    setTags([]);
    setTagInput('');
    setAiAssisted(false);
    setPublished(false);
    setReadingTime(5);
    setSelectedBlog(null);
  };

  const populateEditForm = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCoverImage(blog.coverImage);
    setCoverImagePreview(blog.coverImage.startsWith('http') ? blog.coverImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${blog.coverImage}`);
    setTags(blog.tags);
    setAiAssisted(blog.aiAssisted);
    setPublished(blog.published);
    setReadingTime(blog.readingTime);
    setIsEditOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(selectedBlog?.title || '')) {
      setSlug(generateSlug(value));
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImageFile) {
      toast.error('Please upload a cover image');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    formData.append('aiAssisted', String(aiAssisted));
    formData.append('published', String(published));
    formData.append('readingTime', String(readingTime));
    formData.append('coverImage', coverImageFile);
    formData.append('authorId', 'admin'); // Backend should handle this from token though

    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    formData.append('aiAssisted', String(aiAssisted));
    formData.append('published', String(published));
    formData.append('readingTime', String(readingTime));
    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }
    
    updateMutation.mutate({
      id: selectedBlog.id,
      formData
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (published: boolean) => {
    return published 
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      : 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Blog Management"
        description="Create, edit, and manage blog posts for the travel community."
      >
        <Button 
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }} 
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Write New Post
        </Button>
      </DashboardHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <h3 className="text-2xl font-bold mt-1">{blogsData?.total || 0}</h3>
              </div>
              <div className="bg-primary/10 text-primary p-3 rounded-xl">
                <Hash className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-500">{blogsData?.published || 0}</h3>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-500">{blogsData?.drafts || 0}</h3>
              </div>
              <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl">
                <Edit2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Assisted</p>
                <h3 className="text-2xl font-bold mt-1 text-purple-500">{blogsData?.aiAssisted || 0}</h3>
              </div>
              <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog content, including drafts and published posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-sm font-semibold">Post</th>
                  <th className="px-4 py-3 text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold">Tags</th>
                  <th className="px-4 py-3 text-sm font-semibold">Reading Time</th>
                  <th className="px-4 py-3 text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : blogsData?.blogs?.length > 0 ? (
                  blogsData.blogs.map((blog: BlogPost) => (
                    <tr key={blog.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg bg-muted overflow-hidden border shadow-sm flex-shrink-0">
                            {blog.coverImage ? (
                              <img 
                                src={blog.coverImage.startsWith('http') ? blog.coverImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${blog.coverImage}`} 
                                alt={blog.title} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm line-clamp-1">{blog.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{blog.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${getStatusColor(blog.published)} rounded-full px-3 py-1`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                        {blog.aiAssisted && (
                          <Badge variant="outline" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                              {tag}
                            </Badge>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{blog.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {blog.readingTime} min
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedBlog(blog);
                              setIsPreviewOpen(true);
                            }} className="gap-2">
                              <Eye className="h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => populateEditForm(blog)} className="gap-2">
                              <Edit2 className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(`${window.location.origin}/blog/${blog.slug}`)} className="gap-2">
                              <Copy className="h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => togglePublishMutation.mutate({ id: blog.id, published: !blog.published })}
                              className="gap-2"
                              disabled={togglePublishMutation.isPending}
                            >
                              {togglePublishMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : blog.published ? (
                                <Globe className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              {blog.published ? 'Unpublish' : 'Publish Now'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedBlog(blog);
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
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No blog posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Blog Dialog */}
      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setIsEditOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">
              {isCreateOpen ? 'Create New Blog Post' : 'Edit Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {isCreateOpen ? 'Write a new blog post for the travel community.' : 'Edit your blog post content.'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="write" className="rounded-lg">Write</TabsTrigger>
              <TabsTrigger value="preview" className="rounded-lg">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="write" className="space-y-6 py-4">
              <form onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title"
                    value={title} 
                    onChange={(e) => handleTitleChange(e.target.value)} 
                    placeholder="Enter an engaging title..."
                    required 
                    className="rounded-xl text-lg" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="slug"
                      value={slug} 
                      onChange={(e) => setSlug(generateSlug(e.target.value))} 
                      placeholder="url-friendly-slug"
                      required 
                      className="rounded-xl flex-1 font-mono" 
                    />
                    <Button type="button" variant="outline" onClick={() => copyToClipboard(slug)} className="rounded-xl">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">URL: /blog/{slug || 'your-slug'}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image *</Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input 
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="rounded-xl cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Recommended size: 1200x630px. Max 10MB.</p>
                    </div>
                  </div>
                  {coverImagePreview && (
                    <div className="mt-2 rounded-xl overflow-hidden border-2 border-primary/10 relative group">
                      <img src={coverImagePreview} alt="Cover preview" className="w-full h-48 object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          setCoverImageFile(null);
                          setCoverImagePreview('');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea 
                    id="excerpt"
                    value={excerpt} 
                    onChange={(e) => setExcerpt(e.target.value)} 
                    placeholder="A short summary of the post..."
                    required 
                    className="rounded-xl min-h-[80px]" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea 
                    id="content"
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Write your blog content here..."
                    required 
                    className="rounded-xl min-h-[300px] font-mono text-sm" 
                  />
                </div>

                <div className="space-y-3">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      placeholder="Add a tag..." 
                      className="rounded-xl flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="rounded-xl">
                      Add Tag
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="border rounded-xl p-3 bg-muted/20">
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
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-muted-foreground mr-1">Suggested:</span>
                    {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (tags.length < 10) {
                            setTags([...tags, tag]);
                          } else {
                            toast.error('Maximum 10 tags allowed');
                          }
                        }}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                    <Input 
                      id="readingTime"
                      type="number"
                      value={readingTime} 
                      onChange={(e) => setReadingTime(parseInt(e.target.value) || 5)} 
                      className="rounded-xl"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="aiAssisted"
                        checked={aiAssisted}
                        onCheckedChange={setAiAssisted}
                      />
                      <Label htmlFor="aiAssisted" className="cursor-pointer">AI Assisted Writing</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    {published ? 'Publish immediately' : 'Save as draft'}
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
                    {isCreateOpen ? 'Create Post' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="preview" className="py-4">
              <div className="space-y-6">
                {coverImagePreview && (
                  <div className="rounded-2xl overflow-hidden border">
                    <img src={coverImagePreview} alt={title} className="w-full h-64 object-cover" />
                  </div>
                )}
                <h1 className="text-3xl font-bold font-heading">{title || 'Untitled Post'}</h1>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
                </div>
                <p className="text-lg text-muted-foreground italic">{excerpt || 'No excerpt provided'}</p>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{content || 'No content yet...'}</p>
                </div>
                {tags.length > 0 && (
                  <div className="flex gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Blog Preview</DialogTitle>
            <DialogDescription>
              Preview of "{selectedBlog?.title}"
            </DialogDescription>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-6 py-4">
              <div className="rounded-2xl overflow-hidden border">
                <img 
                  src={selectedBlog.coverImage.startsWith('http') ? selectedBlog.coverImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selectedBlog.coverImage}`} 
                  alt={selectedBlog.title} 
                  className="w-full h-64 object-cover" 
                />
              </div>
              <h1 className="text-3xl font-bold font-heading">{selectedBlog.title}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedBlog.readingTime} min read
                </span>
                <span className="flex items-center gap-1">
                  by {selectedBlog.author.name}
                </span>
              </div>
              <p className="text-lg text-muted-foreground italic">{selectedBlog.excerpt}</p>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
              </div>
              {selectedBlog.tags.length > 0 && (
                <div className="flex gap-2">
                  {selectedBlog.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
              {selectedBlog.aiAssisted && (
                <div className="bg-purple-500/10 rounded-xl p-3 text-sm text-purple-600">
                  <Sparkles className="h-4 w-4 inline mr-2" />
                  This post was created with AI assistance
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedBlog?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedBlog && deleteMutation.mutate(selectedBlog.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}