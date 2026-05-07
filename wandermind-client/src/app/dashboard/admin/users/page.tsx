'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Button as ShadButton } from '@/components/ui/button';
import { Users, MapPin, FileText, TrendingUp, UserCog, Shield, ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TRAVELER' | 'HOST' | 'ADMIN';
  image: string | null;
  createdAt: string;
  _count?: {
    bookings: number;
    experiences: number;
  };
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  roleCounts?: Record<string, number>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminDashboard() {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>('');
  const limit = 10;

  // Fetch users with pagination and search
  const { data: usersData, isLoading } = useQuery<PaginatedResponse<User>>({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const res = await api.get('/admin/users', {
        params: { page, limit, search }
      });
      return res as any; // Cast as any then to PaginatedResponse via useQuery generic
    }
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await api.patch(`/admin/users/${userId}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const confirmRoleUpdate = () => {
    if (selectedUser && newRole && newRole !== selectedUser.role) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    } else {
      setIsRoleDialogOpen(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HOST':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const totalPages = Math.ceil((usersData?.pagination?.total || 0) / limit);

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="User Management Center"
        description="Monitor system activity and manage users, roles, and permissions."
      >   
      </DashboardHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{usersData?.pagination?.total || 0}</h3>
              </div>
              <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hosts</p>
                <h3 className="text-2xl font-bold mt-1">{usersData?.roleCounts?.HOST || 0}</h3>
              </div>
              <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl">
                <Shield className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Travelers</p>
                <h3 className="text-2xl font-bold mt-1">{usersData?.roleCounts?.TRAVELER || 0}</h3>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <h3 className="text-2xl font-bold mt-1">{usersData?.roleCounts?.ADMIN || 0}</h3>
              </div>
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl">
                <UserCog className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user roles and permissions across the platform. {currentUser?.role === 'ADMIN' && 'You have full administrative access.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-sm font-semibold">User</th>
                  <th className="px-4 py-3 text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-sm font-semibold">Bookings</th>
                  <th className="px-4 py-3 text-sm font-semibold">Joined</th>
                  <th className="px-4 py-3 text-sm font-semibold text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-10 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : (usersData?.data?.length ?? 0) > 0 ? (
                  usersData?.data?.map((user: User) => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="font-medium text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={`${getRoleBadgeColor(user.role)} rounded-full px-3 py-1`}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{user._count?.bookings || 0}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ShadButton 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 rounded-lg"
                          onClick={() => handleRoleChange(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          <UserCog className="h-3 w-3" />
                          Change Role
                        </ShadButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, usersData?.pagination?.total || 0)} of {usersData?.pagination?.total || 0} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}. This will affect their permissions across the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRAVELER">Traveler - Can book experiences and create itineraries</SelectItem>
                  <SelectItem value="HOST">Host - Can create and manage experiences</SelectItem>
                  <SelectItem value="ADMIN">Admin - Full system access (including user management)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedUser?.role === 'ADMIN' && newRole !== 'ADMIN' && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-600">
                ⚠️ Removing admin privileges from this user will restrict their access to administrative features.
              </div>
            )}
            
            {newRole === 'ADMIN' && selectedUser?.role !== 'ADMIN' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-600">
                ⚠️ Granting admin access gives this user full control over the platform. Only proceed if you trust this user completely.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={confirmRoleUpdate} 
              className="rounded-xl gap-2"
              disabled={updateRoleMutation.isPending || newRole === selectedUser?.role}
            >
              {updateRoleMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}