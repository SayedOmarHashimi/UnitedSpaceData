import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadPortal from "@/components/UploadPortal";
import DocumentLibrary from "@/components/DocumentLibrary";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <HeroSection />
        <div className="relative z-10">
          <StatsSection />
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.2)] to-transparent" />
          <DocumentLibrary />
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.2)] to-transparent" />
          <UploadPortal />
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.2)] to-transparent" />
          <AboutSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
