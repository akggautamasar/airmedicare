
import { useState } from 'react';
import { SearchControls } from './SearchControls';
import { FacilityList } from './FacilityList';
import { DataCollection } from './DataCollection';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useFacilityData } from '@/hooks/useFacilityData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LocationSearch = () => {
  const [facilityType, setFacilityType] = useState('all');
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

  // States for district-based search
  const [selectedState, setSelectedState] = useState("UP");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [activeTab, setActiveTab] = useState("search");

  const handleSearchFacilities = () => {
    const method = document.querySelector('[data-state="active"][data-radix-collection-item]')?.getAttribute('value');
    
    if (method === 'stateDistrict') {
      // Get the selected state and district values and use them for searching
      searchFacilities(null, "", facilityType, geocodeSearchQuery, selectedState, selectedDistrict);
    } else {
      // Use location-based search
      searchFacilities(userLocation, searchQuery, facilityType, geocodeSearchQuery);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="search" className="flex-1">
            Search Facilities
          </TabsTrigger>
          <TabsTrigger value="collect" className="flex-1">
            Data Collection
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
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
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />

          <FacilityList
            facilities={facilities}
            isLoading={isLoading}
            isSaving={isSaving}
            searchQuery={searchQuery}
            userLocationExists={!!userLocation}
          />
        </TabsContent>
        
        <TabsContent value="collect">
          <DataCollection />
        </TabsContent>
      </Tabs>
    </div>
  );
};
