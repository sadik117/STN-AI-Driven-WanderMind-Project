'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Calendar, 
  Settings, 
  Users, 
  FileText, 
  Image as ImageIcon,
  Heart,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const role = user?.role.toLowerCase() || 'traveler';

  const menuItems = {
    traveler: [
      { name: 'Overview', href: `/dashboard/traveler`, icon: LayoutDashboard },
      { name: 'My Itineraries', href: `/dashboard/traveler/itineraries`, icon: MapIcon },
      { name: 'My Bookings', href: `/dashboard/traveler/bookings`, icon: Calendar },
      { name: 'Saved Places', href: `/dashboard/traveler/saved`, icon: Heart },
      { name: 'Settings', href: `/dashboard/traveler/profile`, icon: Settings },
    ],
    admin: [
      { name: 'Overview', href: `/dashboard/admin`, icon: LayoutDashboard },
      { name: 'User Management', href: `/dashboard/admin/users`, icon: Users },
      { name: 'Destinations', href: `/dashboard/admin/destinations`, icon: ImageIcon },
      { name: 'All Bookings', href: `/dashboard/admin/all-bookings`, icon: Calendar },
      { name: 'Blog Posts', href: `/dashboard/admin/blogs`, icon: FileText },
    ],
    host: [
      { name: 'Overview', href: `/dashboard/host`, icon: LayoutDashboard },
      { name: 'My Experiences', href: `/dashboard/host/experiences`, icon: ImageIcon },
      { name: 'Bookings', href: `/dashboard/host/bookings`, icon: Calendar },
      { name: 'Settings', href: `/dashboard/host/profile`, icon: Settings },
    ]
  };

  const currentMenuItems = menuItems[role as keyof typeof menuItems] || menuItems.traveler;

  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-64px)] sticky top-16 hidden md:flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Main Menu
          </p>
          <nav className="space-y-1">
            {currentMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4", isActive ? "" : "text-muted-foreground group-hover:text-accent-foreground")} />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
