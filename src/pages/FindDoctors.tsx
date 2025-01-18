import { Navbar } from "@/components/Navbar";
import { HospitalSearch } from "@/components/HospitalSearch";

const FindDoctors = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Doctors</h1>
        <HospitalSearch />
      </div>
    </div>
  );
};

export default FindDoctors;