"use client"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { myPackingListsQuery, PackingList } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Backpack, MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function PackingListsPage() {
  const { data, isLoading, error } = useQuery(myPackingListsQuery);
  const lists = (Array.isArray(data) ? data : (data as any)?.data) || [];

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="My Packing Lists" 
        description="View and manage all your AI-generated packing lists."
      >
        <Link href="/smart-packing">
          <Button className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg">
            <Backpack className="h-4 w-4" />
            Generate New List
          </Button>
        </Link>
      </DashboardHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-3xl" />)}
        </div>
      ) : lists.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Backpack className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">No Packing Lists Found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">You haven't generated any smart packing lists yet. Let our AI build one for you based on the weather and activities.</p>
            <Link href="/smart-packing">
              <Button className="rounded-xl h-12 px-6">Create Packing List</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list: PackingList, idx: number) => (
            <motion.div 
              key={list.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full rounded-3xl hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="p-6 pb-4 border-b border-border/50 bg-primary/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        <Backpack className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary font-bold">
                        {list.itemsJson?.length || 0} Categories
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold font-heading line-clamp-1 mb-2">{list.destination}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-wider">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(list.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="p-6 bg-card space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-muted p-1.5 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                      <span className="font-semibold">{list.tripType}</span> Trip
                    </div>
                    {(list.startDate || list.endDate) && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="bg-muted p-1.5 rounded-lg"><Calendar className="h-4 w-4 text-primary" /></div>
                        <span className="font-medium">
                          {list.startDate && format(new Date(list.startDate), 'MMM dd')} - {list.endDate && format(new Date(list.endDate), 'MMM dd')}
                        </span>
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                         <Button variant="outline" className="w-full mt-6 rounded-xl border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                           View Details <ChevronRight className="h-4 w-4 ml-1" />
                         </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader className="mb-4">
                          <DialogTitle className="text-2xl font-heading flex items-center gap-3 text-primary">
                            <Backpack className="h-6 w-6" /> Packing List: {list.destination}
                          </DialogTitle>
                          <DialogDescription className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider mt-2">
                            <span className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-md text-primary"><MapPin className="h-3.5 w-3.5" /> {list.tripType}</span>
                            {(list.startDate || list.endDate) && (
                              <span className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
                                <Calendar className="h-3.5 w-3.5" /> 
                                {list.startDate && format(new Date(list.startDate), 'MMM dd')} - {list.endDate && format(new Date(list.endDate), 'MMM dd')}
                              </span>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {list.itemsJson?.map((category: any, i: number) => (
                            <div key={i} className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:border-primary/20 transition-colors">
                              <h4 className="font-bold flex items-center gap-2 mb-4 text-foreground/80">
                                <span className="text-xl">{category.icon}</span> {category.name}
                              </h4>
                              <ul className="space-y-3">
                                {category.items?.map((item: any, j: number) => (
                                  <li key={j} className="flex items-start justify-between gap-3 text-sm">
                                    <div className="flex items-start gap-2 pt-0.5">
                                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${item.essential ? 'bg-rose-500' : 'bg-muted-foreground/30'}`} />
                                      <span className={item.essential ? 'font-medium' : 'text-muted-foreground'}>{item.name}</span>
                                    </div>
                                    {item.quantity && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md whitespace-nowrap">{item.quantity}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
