import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularDestinations } from "@/components/home/PopularDestinations";
import { AIShowcase } from "@/components/home/AIShowcase";
import { TopExperiences } from "@/components/home/TopExperiences";
import { StatsSection } from "@/components/home/StatsSection";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <HowItWorks />
      <PopularDestinations />
      <AIShowcase />
      <TopExperiences />
      <StatsSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
