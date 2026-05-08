'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Map, 
  User, 
  Menu, 
  ChevronDown, 
  LogOut, 
  Home, 
  Compass, 
  Sparkles, 
  BookOpen,
  Globe,
  X,
  Heart,
  Settings,
  LayoutDashboard,
  Plane,
  Star,
  Bell,
  HelpCircle,
  Shield,
  Badge
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthPage) return null;

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/destinations', label: 'Destinations', icon: Compass },
    { href: '/experiences', label: 'Experiences', icon: Star },
    { href: '/ai-planner', label: 'AI Planner', icon: Sparkles },
    { href: '/blog', label: 'Blog', icon: BookOpen },
  ];

  const getDashboardLink = () => {
    switch (user?.role?.toLowerCase()) {
      case 'admin': return '/dashboard/admin';
      case 'host': return '/dashboard/host';
      default: return '/dashboard/traveler';
    }
  };


  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-md border-b shadow-lg' 
            : 'bg-background/80 backdrop-blur-sm border-b'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-1.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Map className="h-5 w-5" />
            </motion.div>
            <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              WanderMind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-4"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-2 px-2 rounded-full hover:bg-primary/10 transition-all"
                  >
                    <motion.div 
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      {user?.image ? (
                        <img src={user.image} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </motion.div>
                    <span className="text-sm font-medium hidden sm:inline-block text-foreground">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1 border-border/50 shadow-xl">
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href={getDashboardLink()} className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href={`${getDashboardLink()}/profile`} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[350px] p-0 rounded-l-3xl border-l-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center justify-between mb-4">
                      <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                          <Map className="h-5 w-5" />
                        </div>
                        <span className="font-heading font-bold text-xl">WanderMind</span>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {isAuthenticated && (
                      <div className="flex items-center gap-3 mt-2 p-3 bg-muted/50 rounded-2xl">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage src={user?.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                          <Badge  className="mt-1 text-[10px] px-2 py-0 rounded-full">
                            {user?.role || 'Traveler'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                        Navigation
                      </p>
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive(link.href)
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-muted-foreground hover:bg-muted/50'
                          }`}
                        >
                          <link.icon className="h-5 w-5" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>

                    {isAuthenticated && (
                      <>
                        <div className="mt-6 pt-4 border-t">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                            Account
                          </p>
                          <div className="space-y-1">
                            <Link
                              href={getDashboardLink()}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href={`${getDashboardLink()}/profile`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
                            >
                              <User className="h-5 w-5" />
                              <span>Profile Settings</span>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Menu Footer - Logout Button */}
                  <div className="p-6 border-t bg-muted/20">
                    {!isAuthenticated ? (
                      <div className="space-y-2">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full rounded-xl">
                            Log In
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          variant="destructive" 
                          className="w-full rounded-xl gap-2 h-11 text-base font-semibold shadow-lg"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-5 w-5" />
                          Log Out
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                          © 2024 WanderMind. All rights reserved.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16" />
    </>
  );
}