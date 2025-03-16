
import { FacilityCard } from './FacilityCard';
import { Facility } from '@/hooks/useFacilityData';

interface FacilityListProps {
  facilities: Facility[];
  isLoading: boolean;
  isSaving: boolean;
  searchQuery: string;
  userLocationExists: boolean;
}

export const FacilityList = ({ 
  facilities, 
  isLoading, 
  isSaving, 
  searchQuery, 
  userLocationExists 
}: FacilityListProps) => {
  if (facilities.length === 0 && !isLoading && !isSaving) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery || userLocationExists
          ? 'No facilities found in this area. Try expanding your search.'
          : 'Use the search box or your current location to find healthcare facilities.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {facilities.map((facility) => (
        <FacilityCard key={facility.id} facility={facility} />
      ))}
    </div>
  );
};
