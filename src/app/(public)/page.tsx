import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { Footer } from "./_components/footer";
import { LandingHeader } from "./_components/landing-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/0.08),var(--background)]" />
      <LandingHeader />
      <main className="pt-14">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
