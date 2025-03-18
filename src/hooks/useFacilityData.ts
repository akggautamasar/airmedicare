import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { indianStates } from '@/data/indianStates';

interface Location {
  latitude: number;
  longitude: number;
  displayName?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  address: string;
  contact?: string;
  website?: string;
  openNow: boolean;
  imageUrl?: string;
  district?: string;
}

interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    'addr:district'?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    healthcare?: string;
    [key: string]: string | undefined;
  };
  type: string;
}

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
          saveFacilitiesToDatabase(nearbyFacilities, searchLocation.lat, searchLocation.lon, districtName, stateName);
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

  const searchFacilitiesInDatabase = async (
    latitude: number, 
    longitude: number, 
    type: string,
    selectedState?: string,
    selectedDistrict?: string,
    districtName?: string,
    stateName?: string
  ): Promise<Facility[]> => {
    try {
      let facilityType = type;
      if (type === 'medical-store') facilityType = 'pharmacy';
      if (type === 'pathology') facilityType = 'laboratory';
      
      let query = supabase
        .from('healthcare_facilities')
        .select('*');
      
      if (facilityType !== 'all') {
        query = query.eq('type', facilityType);
      }
      
      if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
        console.log(`🔍 Database search: Filtering strictly for district: ${districtName}`);
        query = query.ilike('district', `%${districtName}%`);
      } 
      else if (selectedState && stateName) {
        console.log(`🔍 Database search: Filtering for state: ${stateName}`);
        query = query.ilike('state', `%${stateName}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(30);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log('⚠️ No results found in database with current filters');
        return [];
      }
      
      console.log(`✅ Found ${data.length} facilities in database`);
      
      const formattedResults = data.map(facility => {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          Number(facility.latitude), 
          Number(facility.longitude)
        );
        
        return {
          id: facility.id,
          name: facility.name,
          type: facility.type,
          distance: `${distance.toFixed(1)} km`,
          rating: facility.rating || 4.0,
          address: facility.address || 'Address not available',
          contact: facility.contact,
          website: facility.website,
          district: facility.district,
          openNow: Math.random() > 0.3,
          imageUrl: facility.image_urls && facility.image_urls.length > 0 
            ? facility.image_urls[0] 
            : undefined
        };
      });
      
      if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
        const verifiedResults = formattedResults.filter(facility => {
          const includesDistrict = 
            facility.district?.toLowerCase().includes(districtName.toLowerCase()) || 
            (facility.address && facility.address.toLowerCase().includes(districtName.toLowerCase()));
          return includesDistrict;
        });
        
        console.log(`🔍 After verification: ${verifiedResults.length} facilities match district "${districtName}"`);
        return verifiedResults;
      }
      
      return formattedResults;
    } catch (error) {
      console.error('Error searching database:', error);
      return [];
    }
  };

  const searchNearbyFacilities = async (
    latitude: number,
    longitude: number,
    type: string,
    selectedState?: string,
    selectedDistrict?: string,
    districtName?: string,
    stateName?: string
  ): Promise<Facility[]> => {
    try {
      const radius = 10000;
      let amenityType = 'hospital';
      
      switch (type) {
        case 'hospital':
          amenityType = 'hospital';
          break;
        case 'medical-store':
          amenityType = 'pharmacy';
          break;
        case 'pathology':
          amenityType = 'doctors|laboratory';
          break;
        case 'clinic':
          amenityType = 'clinic';
          break;
        case 'all':
          amenityType = 'hospital|pharmacy|doctors|clinic|laboratory';
          break;
        default:
          amenityType = 'hospital';
      }
      
      let overpassQuery = '';
      if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
        overpassQuery = `
          [out:json];
          area[name~"${districtName}"]->.searchArea;
          node["amenity"~"${amenityType}"](area.searchArea);
          out body;
        `;
      } else {
        overpassQuery = `
          [out:json];
          node["amenity"~"${amenityType}"](around:${radius},${latitude},${longitude});
          out body;
        `;
      }
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'HealthcareApp/1.0',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to search for nearby facilities');
      }
      
      const data = await response.json();
      console.log(`🌍 Overpass API found ${data.elements?.length || 0} facilities`);
      
      if (!data.elements || data.elements.length === 0) {
        console.log('⚠️ No results from OpenStreetMap API');
        if (selectedDistrict && selectedDistrict !== 'all') {
          console.log('🔄 Trying fallback radius-based search');
          const fallbackQuery = `
            [out:json];
            node["amenity"~"${amenityType}"](around:${radius},${latitude},${longitude});
            out body;
          `;
          
          const fallbackResponse = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: fallbackQuery,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'HealthcareApp/1.0',
            },
          });
          
          if (!fallbackResponse.ok) {
            return [];
          }
          
          const fallbackData = await fallbackResponse.json();
          data.elements = fallbackData.elements || [];
        } else {
          return [];
        }
      }
      
      const allFacilities: Facility[] = data.elements.map((element: any) => {
        const facilityLat = element.lat;
        const facilityLon = element.lon;
        const distance = calculateDistance(latitude, longitude, facilityLat, facilityLon);
        
        const imageId = getRandomImageId(element.tags?.amenity || amenityType);
        
        const facilityDistrict = element.tags?.['addr:district'] || 
                              element.tags?.['addr:city'] || 
                              districtName || 
                              'Unknown';
        
        return {
          id: element.id.toString(),
          name: element.tags?.name || `${element.tags?.amenity ? element.tags.amenity.charAt(0).toUpperCase() + element.tags.amenity.slice(1) : 'Healthcare'} Facility`,
          type: element.tags?.amenity || amenityType,
          distance: `${distance.toFixed(1)} km`,
          rating: Math.floor(Math.random() * 50 + 30) / 10,
          address: element.tags?.['addr:street'] 
            ? `${element.tags?.['addr:housenumber'] || ''} ${element.tags?.['addr:street'] || ''}, ${element.tags?.['addr:city'] || ''}`
            : 'Address unavailable',
          contact: element.tags?.phone,
          website: element.tags?.website,
          district: facilityDistrict,
          openNow: element.tags?.opening_hours ? !element.tags.opening_hours.includes('closed') : Math.random() > 0.3,
          imageUrl: `https://source.unsplash.com/${imageId}`
        };
      });

      console.log(`🏥 Found ${allFacilities.length} facilities from OpenStreetMap`);

      let facilities = allFacilities;
      
      if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
        console.log(`🔍 Filtering OpenStreetMap results for district: ${districtName}`);
        
        let districtFacilities = allFacilities.filter(facility => {
          const districtMatch = 
            facility.district?.toLowerCase() === districtName.toLowerCase() ||
            (facility.address && facility.address.toLowerCase().includes(districtName.toLowerCase()));
          return districtMatch;
        });
        
        if (districtFacilities.length === 0) {
          districtFacilities = allFacilities.filter(facility => {
            const flexMatch = 
              (facility.district && facility.district.toLowerCase().includes(districtName.toLowerCase())) ||
              (districtName.toLowerCase().includes(facility.district?.toLowerCase() || '')) ||
              (facility.address && facility.address.toLowerCase().includes(districtName.toLowerCase()));
            return flexMatch;
          });
        }
        
        console.log(`✅ After district filtering: ${districtFacilities.length} facilities match`);
        
        if (districtFacilities.length === 0 && allFacilities.length > 0) {
          console.log('⚠️ No facilities match the district exactly, sorting by distance');
          return allFacilities
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
            .slice(0, 10);
        }
        
        return districtFacilities;
      } 
      else if (selectedState && selectedState !== 'all' && stateName) {
        console.log(`🔍 Filtering OpenStreetMap results for state: ${stateName}`);
        const stateFacilities = allFacilities.filter(facility => {
          return facility.address?.toLowerCase().includes(stateName.toLowerCase());
        });
        
        console.log(`✅ After state filtering: ${stateFacilities.length} facilities match`);
        return stateFacilities.length > 0 ? stateFacilities : allFacilities;
      }

      return facilities;
    } catch (error) {
      console.error('Error searching nearby facilities:', error);
      return [];
    }
  };

  const saveFacilitiesToDatabase = async (
    facilities: Facility[], 
    latitude: number, 
    longitude: number, 
    district?: string,
    state?: string
  ) => {
    if (!facilities.length) return;
    
    setIsSaving(true);
    toast({
      title: 'Saving Data',
      description: 'Saving facility information to our database...',
    });
    
    try {
      const facilitiesData = facilities.map(facility => {
        let services = [facility.type];
        if (facility.name.toLowerCase().includes('emergency')) services.push('Emergency Care');
        if (facility.type === 'hospital') services.push('General Checkup');
        
        return {
          osm_id: facility.id,
          name: facility.name,
          type: facility.type,
          address: facility.address,
          latitude: latitude,
          longitude: longitude,
          contact: facility.contact || null,
          website: facility.website || null,
          services: services,
          rating: facility.rating,
          image_urls: facility.imageUrl ? [facility.imageUrl] : [],
          district: facility.district || district || 'Unknown',
          state: state || 'Unknown',
        };
      });
      
      const { error } = await supabase
        .from('healthcare_facilities')
        .upsert(facilitiesData, { 
          onConflict: 'osm_id',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      toast({
        title: 'Data Saved',
        description: `Successfully saved ${facilities.length} facilities to our database.`,
      });
    } catch (error) {
      console.error('Error saving facilities to database:', error);
      toast({
        title: 'Save Error',
        description: 'Failed to save facility data to our database.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getRandomImageId = (facilityType: string): string => {
    const hospitalImages = ['y5hQCIn1C6o', 's4qDC1iSaTY', 'L4iI59WB4Yw', 'cGNCepznaV8'];
    const pharmacyImages = ['DPEPYPBZpfs', 'Vcm2lHXVz-o', '7jd3jKVEv3M', '2IBhAEtupH8'];
    const labImages = ['nOVQ8Gj1i8E', 'L8tWZT4CcVQ', '66JMmdEIn9E', 'HJckKnwCXxQ'];
    
    if (facilityType === 'pharmacy' || facilityType === 'medical-store') {
      return pharmacyImages[Math.floor(Math.random() * pharmacyImages.length)];
    } else if (facilityType === 'laboratory' || facilityType === 'doctors' || facilityType === 'pathology') {
      return labImages[Math.floor(Math.random() * labImages.length)];
    } else {
      return hospitalImages[Math.floor(Math.random() * hospitalImages.length)];
    }
  };

  return {
    facilities,
    isLoading,
    isSaving,
    searchFacilities,
  };
};
