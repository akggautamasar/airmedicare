import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { LocationSearch } from "@/components/LocationSearch";
import { HospitalSearch } from "@/components/HospitalSearch";
import { MedicineSearch } from "@/components/MedicineSearch";
import { HealthRecords } from "@/components/HealthRecords";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <LocationSearch />
      <Features />
      <HospitalSearch />
      <MedicineSearch />
      <HealthRecords />
    </div>
  );
};

export default Index;