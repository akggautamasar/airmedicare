
import { Navbar } from "@/components/Navbar";
import { LocationSearch } from "@/components/LocationSearch";

const FindFacilities = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Healthcare Facilities</h1>
        <LocationSearch />
      </div>
    </div>
  );
};

export default FindFacilities;
