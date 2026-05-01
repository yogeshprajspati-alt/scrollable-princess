import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { ThirdSection } from "@/components/sections/ThirdSection";
import { SystemsNominal } from "@/components/sections/SystemsNominal";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CinematicReveal />
        <ThirdSection />
        <SystemsNominal />
      </main>
      <Footer />
    </>
  );
}
