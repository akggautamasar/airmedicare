
import { Facility } from "@/hooks/useHospitalFacilityData";
import { HospitalFacilityCard } from "./HospitalFacilityCard";

interface HospitalFacilityListProps {
  facilities: Facility[];
  isLoading: boolean;
}

export const HospitalFacilityList = ({ facilities, isLoading }: HospitalFacilityListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-gray-600">Searching for healthcare facilities...</p>
      </div>
    );
  } 
  
  if (facilities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No healthcare facilities found. Try changing your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility) => (
        <HospitalFacilityCard key={facility.id} facility={facility} />
      ))}
    </div>
  );
};
