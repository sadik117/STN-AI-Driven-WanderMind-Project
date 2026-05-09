'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileDashboardNav } from '@/components/dashboard/MobileDashboardNav';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []); // Run only once on mount to avoid loops

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login'); // Use replace to avoid history stack bloat
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-7xl px-4">
          <Skeleton className="h-12 w-[250px]" />
          <div className="flex gap-6">
            <Skeleton className="h-[600px] w-64" />
            <Skeleton className="h-[600px] flex-1" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <MobileDashboardNav />
    </div>
  );
}
