"use client"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { myJournalsQuery, JournalEntry } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, MapPin, Calendar, Clock, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function JournalsPage() {
  const { data, isLoading, error } = useQuery(myJournalsQuery);
  const journals = (Array.isArray(data) ? data : (data as any)?.data) || [];

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="My Travel Journals" 
        description="View and manage all your AI-polished travel stories."
      >
        <Link href="/journal-summarizer">
          <Button className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg">
            <BookOpen className="h-4 w-4" />
            Create Journal
          </Button>
        </Link>
      </DashboardHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}
        </div>
      ) : journals.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">No Journals Found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">You haven't summarized any travel notes yet. Turn your messy thoughts into beautiful stories with WanderMind AI.</p>
            <Link href="/journal-summarizer">
              <Button className="rounded-xl h-12 px-6">Create Journal</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {journals.map((journal: JournalEntry, idx: number) => (
            <motion.div 
              key={journal.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full rounded-3xl hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden flex flex-col group">
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="p-6 pb-4 border-b border-border/50 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                    <h3 className="text-2xl font-bold font-heading line-clamp-1 mb-3 text-primary pr-8">{journal.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md"><MapPin className="h-3.5 w-3.5 text-primary" /> {journal.destination}</span>
                      <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md"><Calendar className="h-3.5 w-3.5 text-primary" /> {format(new Date(journal.travelDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-card flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {journal.aiSummary || journal.rawNotes}
                    </p>
                    <div className="space-y-4 mt-auto pt-4 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                        {journal.hashtags?.slice(0, 4).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-primary/5 hover:bg-primary/10 transition-colors border-primary/20 rounded-lg py-1">
                            <Hash className="h-3 w-3 mr-0.5 text-primary" /> {tag.replace('#', '')}
                          </Badge>
                        ))}
                        {journal.hashtags?.length > 4 && (
                          <Badge variant="outline" className="text-xs bg-muted/50 rounded-lg py-1">+{journal.hashtags.length - 4}</Badge>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="ghost" className="w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                             Read Full Story <ChevronRight className="h-4 w-4 ml-1" />
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-heading text-primary pr-8">{journal.title}</DialogTitle>
                            <DialogDescription className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider mt-2">
                              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {journal.destination}</span>
                              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(new Date(journal.travelDate), 'MMM dd, yyyy')}</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-6">
                            <div className="prose dark:prose-invert max-w-none">
                              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-[15px]">{journal.aiSummary || journal.rawNotes}</p>
                            </div>
                            
                            {journal.highlights && journal.highlights.length > 0 && (
                              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">✨ Trip Highlights</h4>
                                <ul className="space-y-3">
                                  {journal.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                      <span className="leading-relaxed">{h}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                              {journal.hashtags?.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="bg-muted">
                                   {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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
