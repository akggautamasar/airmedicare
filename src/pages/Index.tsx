import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { LocationSearch } from "@/components/LocationSearch";
import { HospitalSearch } from "@/components/HospitalSearch";
import { HealthRecords } from "@/components/HealthRecords";
import { YouTubeVideos } from "@/components/YouTubeVideos";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <LocationSearch />
      <Features />
      <HospitalSearch />
      <YouTubeVideos />
      <HealthRecords />
    </div>
  );
};

export default Index;