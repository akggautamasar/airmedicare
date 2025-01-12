import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HospitalSearch } from "@/components/HospitalSearch";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <HospitalSearch />
      <Features />
    </div>
  );
};

export default Index;