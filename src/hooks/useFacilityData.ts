
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Facility, Location } from '@/types/facility';
import { searchFacilitiesInDatabase, saveFacilitiesToDatabase } from '@/services/facilityDatabaseService';
import { searchNearbyFacilities } from '@/services/overpassService';
import { indianStates } from '@/data/indianStates';

export type { Facility };

export const useFacilityData = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const searchFacilities = async (
    userLocation: Location | null, 
    searchQuery: string, 
    facilityType: string,
    geocodeSearchQuery: (query: string) => Promise<{ lat: number; lon: number, displayName?: string } | null>,
    selectedState?: string,
    selectedDistrict?: string
  ) => {
    setIsLoading(true);
    
    try {
      let searchLocation: { lat: number; lon: number, displayName?: string } | null = null;
      let districtName = "";
      let stateName = "";
      
      if (selectedState) {
        const state = indianStates.find(s => s.code === selectedState);
        stateName = state?.name || "";
        
        if (selectedDistrict && selectedDistrict !== 'all') {
          const district = state?.districts.find(d => d.code === selectedDistrict);
          if (district) {
            districtName = district.name;
            console.log(`🔍 Searching specifically for: ${districtName}, ${stateName}`);
            
            const locationQuery = `${district.name}, ${state?.name || ''}, India`;
            searchLocation = await geocodeSearchQuery(locationQuery);
            
            if (!searchLocation) {
              throw new Error(`Could not determine location for ${locationQuery}`);
            }
          }
        } else if (state) {
          console.log(`🔍 Searching for all facilities in state: ${stateName}`);
          const locationQuery = `${state.name}, India`;
          searchLocation = await geocodeSearchQuery(locationQuery);
        }
      } 
      else if (searchQuery) {
        searchLocation = await geocodeSearchQuery(searchQuery);
      } 
      else if (userLocation) {
        searchLocation = {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
          displayName: userLocation.displayName
        };
      } else {
        toast({
          title: 'Search Error',
          description: 'Please provide a location, search query, or select a district.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      if (!searchLocation) {
        throw new Error('Could not determine search location');
      }
      
      console.log("📍 Search location:", searchLocation);
      console.log("🏙️ Selected district:", selectedDistrict, "District name:", districtName);
      console.log("🏙️ Selected state:", selectedState, "State name:", stateName);
      
      const dbFacilities = await searchFacilitiesInDatabase(
        searchLocation.lat,
        searchLocation.lon,
        facilityType,
        selectedState,
        selectedDistrict,
        districtName,
        stateName
      );
      
      if (dbFacilities.length > 0) {
        console.log(`📊 Found ${dbFacilities.length} facilities in database for ${districtName || stateName || 'your search'}`);
        setFacilities(dbFacilities);
        toast({
          title: 'Facilities Found',
          description: `Found ${dbFacilities.length} facilities in our database.`,
        });
      } else {
        console.log(`🌍 Searching OpenStreetMap for facilities in ${districtName || stateName || 'your area'}`);
        const nearbyFacilities = await searchNearbyFacilities(
          searchLocation.lat,
          searchLocation.lon,
          facilityType,
          selectedState,
          selectedDistrict,
          districtName,
          stateName
        );
        
        setFacilities(nearbyFacilities);
        
        if (nearbyFacilities.length > 0) {
          setIsSaving(true);
          toast({
            title: 'Saving Data',
            description: 'Saving facility information to our database...',
          });
          
          try {
            await saveFacilitiesToDatabase(nearbyFacilities, searchLocation.lat, searchLocation.lon, districtName, stateName);
            toast({
              title: 'Data Saved',
              description: `Successfully saved ${nearbyFacilities.length} facilities to our database.`,
            });
          } catch (error: any) {
            console.error('Error saving facilities to database:', error);
            toast({
              title: 'Save Error',
              description: 'Failed to save facility data to our database.',
              variant: 'destructive',
            });
          } finally {
            setIsSaving(false);
          }
        } else {
          toast({
            title: 'No Results',
            description: `No healthcare facilities found in ${districtName || stateName || 'your area'}.`,
          });
        }
      }
    } catch (error: any) {
      console.error('Error searching for facilities:', error);
      toast({
        title: 'Search Error',
        description: error.message || 'Failed to search for facilities.',
        variant: 'destructive',
      });
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    facilities,
    isLoading,
    isSaving,
    searchFacilities,
  };
};
