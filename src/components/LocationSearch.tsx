
import { useState } from 'react';
import { SearchControls } from './SearchControls';
import { FacilityList } from './FacilityList';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useFacilityData } from '@/hooks/useFacilityData';

export const LocationSearch = () => {
  const [facilityType, setFacilityType] = useState('hospital');
  const { 
    userLocation, 
    searchQuery, 
    setSearchQuery, 
    getUserLocation, 
    geocodeSearchQuery 
  } = useLocationSearch();
  
  const { 
    facilities, 
    isLoading, 
    isSaving, 
    searchFacilities 
  } = useFacilityData();

  const handleSearchFacilities = () => {
    searchFacilities(userLocation, searchQuery, facilityType, geocodeSearchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <SearchControls
        userLocation={userLocation}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onGetUserLocation={getUserLocation}
        onSearchFacilities={handleSearchFacilities}
        isLoading={isLoading}
        isSaving={isSaving}
        facilityType={facilityType}
        onFacilityTypeChange={setFacilityType}
      />

      <FacilityList
        facilities={facilities}
        isLoading={isLoading}
        isSaving={isSaving}
        searchQuery={searchQuery}
        userLocationExists={!!userLocation}
      />
    </div>
  );
};
