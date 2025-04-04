
import { useState, useEffect } from "react";
import { useHospitalLocationSearch } from "@/hooks/useHospitalLocationSearch";
import { useHospitalFacilityData } from "@/hooks/useHospitalFacilityData";
import { HospitalSearchControls } from "./HospitalSearchControls";
import { HospitalFacilityList } from "./HospitalFacilityList";

export const HospitalSearch = () => {
  const [facilityType, setFacilityType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const {
    selectedDistrict,
    setSelectedDistrict,
    selectedState,
    setSelectedState,
    userLocation,
    getUserLocation,
    geocodeDistrict
  } = useHospitalLocationSearch();
  
  const {
    facilities,
    isLoading,
    handleSearch
  } = useHospitalFacilityData();

  const onSearch = () => {
    const activeTabElement = document.querySelector('[data-state="active"][data-radix-collection-item]');
    const searchMethod = activeTabElement?.getAttribute('value') as "location" | "stateDistrict" || "location";

    if (searchMethod === "stateDistrict") {
      handleSearch(
        facilityType,
        selectedDistrict,
        "",
        null,
        geocodeDistrict,
        selectedState
      );
    } else {
      handleSearch(
        facilityType,
        selectedDistrict,
        searchQuery,
        userLocation,
        geocodeDistrict
      );
    }
  };

  useEffect(() => {
    // Initial search when component mounts
    onSearch();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Find Healthcare Facilities in India</h2>
      
      <HospitalSearchControls
        facilityType={facilityType}
        setFacilityType={setFacilityType}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getUserLocation={getUserLocation}
        handleSearch={onSearch}
        isLoading={isLoading}
      />

      <div className="mt-8">
        <HospitalFacilityList
          facilities={facilities}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
