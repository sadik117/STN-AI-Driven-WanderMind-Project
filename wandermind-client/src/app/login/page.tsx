'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Mail, Lock, ArrowRight, Globe, Users, Shield, Briefcase, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const { login: setAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Demo accounts for quick login
  const demoAccounts = {
    traveler: {
      email: 'traveler@wandermind.com',
      password: 'demo123',
      role: 'TRAVELER',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      hoverColor: 'hover:bg-blue-500/20'
    },
    host: {
      email: 'host@wandermind.com',
      password: 'demo123',
      role: 'HOST',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      hoverColor: 'hover:bg-purple-500/20'
    },
    admin: {
      email: 'admin@wandermind.com',
      password: 'demo123',
      role: 'ADMIN',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      hoverColor: 'hover:bg-red-500/20'
    }
  };

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error(error === 'auth_failed' ? 'Google authentication failed' : 'Social login cancelled');
      router.replace('/login');
    }

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        setAuth(user, token);
        toast.success(`Welcome back, ${user.name}!`);
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      } catch (e) {
        toast.error('Failed to process Google login');
      }
    }
  }, [searchParams, setAuth, router]);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: keyof typeof demoAccounts) => {
    setDemoLoading(role);
    try {
      const demo = demoAccounts[role];
      const response = await authService.login({ 
        email: demo.email, 
        password: demo.password 
      });
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success(`Signed in as ${demo.role}`, {
        duration: 4000,
      });
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (error: any) {
      toast.error('Demo login failed. Please make sure demo accounts exist.', {
        description: 'Contact administrator to set up demo accounts.'
      });
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse delay-2000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-card/90 relative z-10">
          <CardHeader className="space-y-4 pt-10 text-center">
            <div className="flex justify-center mb-2">
              <motion.div 
                className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-3 rounded-2xl shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Map className="h-8 w-8" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Log in to access your itineraries and saved places.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/25 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>Sign In <ArrowRight className="h-5 w-5" /></>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-border/50 gap-2 font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                onClick={handleGoogleLogin}
              >
                <Globe className="h-5 w-5 text-red-500" /> 
                Sign in with Google
              </Button>
            </div>

            {/* Demo Login Section */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Demo Access
                  <Sparkles className="h-3 w-3" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(demoAccounts) as Array<keyof typeof demoAccounts>).map((role) => {
                const demo = demoAccounts[role];
                const Icon = demo.icon;
                return (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDemoLogin(role)}
                    disabled={demoLoading !== null}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${demo.bgColor} ${demo.hoverColor} border border-border/50 hover:border-transparent`}
                  >
                    {demoLoading === role ? (
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${demo.color} text-white shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold">{demo.role}</span>
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-muted-foreground mt-4">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Demo credentials are pre-filled for testing
              </span>
            </p>
          </CardContent>
          
          <CardFooter className="bg-muted/30 py-6 border-t flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}