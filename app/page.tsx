import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DocumentLibrary from "@/components/DocumentLibrary";
import UploadPortal from "@/components/UploadPortal";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <HeroSection />
        <DocumentLibrary />
        <UploadPortal />
        <AboutSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
