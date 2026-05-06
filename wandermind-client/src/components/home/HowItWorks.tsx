import { Search, Bot, Compass } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Discover Destinations",
      description: "Browse our curated list of global destinations or use our AI chat to find your perfect match.",
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "Plan with AI",
      description: "Let our AI generate a day-by-day itinerary, budget analysis, and smart packing list.",
    },
    {
      icon: <Compass className="h-8 w-8 text-primary" />,
      title: "Book & Experience",
      description: "Reserve authentic local experiences and enjoy your flawlessly planned journey.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">How WanderMind Works</h2>
          <p className="text-muted-foreground text-lg">Your next adventure is just three simple steps away.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
