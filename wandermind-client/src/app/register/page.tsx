'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Mail, Lock, User, ArrowRight, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/shared/ImageUpload';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.register({ name, email, password, image });
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success('Welcome to WanderMind! Your journey begins now.');
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-lg border-none shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <div className="grid md:grid-cols-1">
          <CardHeader className="space-y-4 pt-10 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg shadow-primary/20">
                <Map className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-heading font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">
              Join thousands of travelers planning their dream trips.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="my-4">
              <ImageUpload 
                onUpload={(url) => setImage(url)} 
                label=""  
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-1">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 gap-2" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Get Started <ArrowRight className="h-5 w-5" /></>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">Or join with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="h-12 rounded-xl border-border/50 gap-2 font-semibold">
                <Globe className="h-5 w-5 text-red-500" /> Sign up with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 py-6 border-t flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in instead
              </Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
