export function StatsSection() {
  const stats = [
    { label: "Trips Planned", value: "50k+" },
    { label: "Destinations", value: "1,200+" },
    { label: "Local Hosts", value: "3,500+" },
    { label: "Happy Travelers", value: "100k+" },
  ];

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-foreground/20">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl md:text-5xl font-heading font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
