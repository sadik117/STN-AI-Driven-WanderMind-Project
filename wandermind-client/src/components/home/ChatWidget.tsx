"use client"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, MapPin, BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your WanderMind travel assistant. Where are you dreaming of going next?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user' as const, content: message };
    setHistory(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const payload = {
        message: userMessage.content,
        history: history.slice(1).map(h => ({ role: h.role, content: h.content })),
        extraDetails: isAuthenticated && user ? `The user's name is ${user.name} and their platform role is ${user.role}. Please address them by their first name naturally when helpful.` : undefined
      };

      const result: any = await aiService.chat(payload);
      const replyText = result.data?.data?.reply || result.data?.reply || result.reply || "I'm sorry, I couldn't process that right now.";
      
      setHistory(prev => [...prev, { role: 'assistant', content: replyText }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    if (content.includes('<recommendations>')) {
      const textPart = content.split('<recommendations>')[0];
      const jsonPart = content.substring(
        content.indexOf('<recommendations>') + 17, 
        content.indexOf('</recommendations>')
      );
      
      try {
        const data = JSON.parse(jsonPart);
        return (
          <div className="space-y-3">
            <p className="text-sm">{textPart}</p>
            <div className="space-y-2 mt-2">
              {data.destinations?.map((dest: any, i: number) => (
                <div key={i} className="bg-background rounded-xl p-3 border shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform" />
                  <div className="flex items-center gap-2 font-bold text-primary mb-1">
                    <MapPin className="h-4 w-4" />
                    {dest.name}, {dest.country}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{dest.reason}</p>
                  <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-border/50">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-semibold">${dest.avgCostPerDay}/day</span>
                    <span className="text-muted-foreground font-medium">{dest.bestFor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } catch(e) {
        return <p className="text-sm whitespace-pre-wrap leading-relaxed">{content.replace(/<recommendations>[\s\S]*<\/recommendations>/, '')}</p>;
      }
    }

    return <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>;
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-2xl flex items-center justify-center text-primary-foreground z-50 border-4 border-background group"
          >
            <BotMessageSquare className="h-8 w-8 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 border-2 border-background"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-100px)] bg-card border-2 border-border/50 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex justify-between items-center text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="bg-background/20 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-heading leading-tight">WanderMind AI</h3>
                  <p className="text-xs opacity-80 font-medium">Destination Discovery Bot</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-background/20 text-primary-foreground rounded-full h-8 w-8 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-background to-primary/5 no-scrollbar"
            >
              {history.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm' 
                        : 'bg-card border border-border/50 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      renderMessageContent(msg.content)
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-3">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground font-medium">Analyzing destinations...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card border-t border-border/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Find me a cheap beach destination"
                  className="flex-1 rounded-full h-12 border-border/50 bg-background/50 focus-visible:ring-primary/50 text-sm px-4"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !message.trim()}
                  className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 transition-all flex-shrink-0 shadow-md"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
