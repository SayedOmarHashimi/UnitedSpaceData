import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import DocumentLibrary from "@/components/DocumentLibrary";
import UploadPortal from "@/components/UploadPortal";
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
        <StatsSection />
        <DocumentLibrary />
        <UploadPortal />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
