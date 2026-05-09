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
  Backpack,
  BookHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileDashboardNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role.toLowerCase() || 'traveler';

  const menuItems = {
    traveler: [
      { name: 'Overview', href: `/dashboard/traveler`, icon: LayoutDashboard },
      { name: 'Itineraries', href: `/dashboard/traveler/itineraries`, icon: MapIcon },
      { name: 'Bookings', href: `/dashboard/traveler/bookings`, icon: Calendar },
      { name: 'Saved', href: `/dashboard/traveler/saved-places`, icon: Heart },
      { name: 'Blogs', href: `/dashboard/traveler/blogs`, icon: FileText },
      { name: 'Packing', href: `/dashboard/traveler/packing-lists`, icon: Backpack },
      { name: 'Journals', href: `/dashboard/traveler/journals`, icon: BookHeart },
    ],
    admin: [
      { name: 'Stats', href: `/dashboard/admin`, icon: LayoutDashboard },
      { name: 'Users', href: `/dashboard/admin/users`, icon: Users },
      { name: 'Places', href: `/dashboard/admin/destinations`, icon: ImageIcon },
      { name: 'Bookings', href: `/dashboard/admin/all-bookings`, icon: Calendar },
      { name: 'Blogs', href: `/dashboard/admin/blogs`, icon: FileText },
    ],
    host: [
      { name: 'Overview', href: `/dashboard/host`, icon: LayoutDashboard },
      { name: 'Experiences', href: `/dashboard/host/experiences`, icon: ImageIcon },
      { name: 'Bookings', href: `/dashboard/host/bookings`, icon: Calendar },
      { name: 'Blogs', href: `/dashboard/admin/blogs`, icon: FileText },
    ]
  };

  const currentMenuItems = menuItems[role as keyof typeof menuItems] || menuItems.traveler;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t md:hidden">
      <nav className="flex items-center overflow-x-auto scrollbar-hide px-2 py-2 gap-2">
        {currentMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-colors min-w-[70px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
