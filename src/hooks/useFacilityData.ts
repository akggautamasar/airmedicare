
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    geocodeSearchQuery: (query: string) => Promise<{ lat: number; lon: number } | null>
  ) => {
    if (!userLocation && !searchQuery) {
      toast({
        title: 'Search Error',
        description: 'Please provide a location or search query.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let searchLocation: { lat: number; lon: number } | null = null;
      
      // If search query is provided, geocode it to get coordinates
      if (searchQuery) {
        searchLocation = await geocodeSearchQuery(searchQuery);
      } else if (userLocation) {
        // Use user's current location
        searchLocation = {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
        };
      }
      
      if (!searchLocation) {
        throw new Error('Could not determine search location');
      }
      
      // First check if we have facilities in our database near the location
      const dbFacilities = await searchFacilitiesInDatabase(
        searchLocation.lat,
        searchLocation.lon,
        facilityType
      );
      
      if (dbFacilities.length > 0) {
        setFacilities(dbFacilities);
        toast({
          title: 'Facilities Found',
          description: `Found ${dbFacilities.length} facilities in our database.`,
        });
      } else {
        // If no facilities in database, search OpenStreetMap
        const nearbyFacilities = await searchNearbyFacilities(
          searchLocation.lat,
          searchLocation.lon,
          facilityType
        );
        
        setFacilities(nearbyFacilities);
        
        // Save facilities to database in the background
        if (nearbyFacilities.length > 0) {
          saveFacilitiesToDatabase(nearbyFacilities, searchLocation.lat, searchLocation.lon);
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
    type: string
  ): Promise<Facility[]> => {
    try {
      // Convert facility type to match database format
      let facilityType = type;
      if (type === 'medical-store') facilityType = 'pharmacy';
      if (type === 'pathology') facilityType = 'laboratory';
      
      // Query database within a radius (simple distance calculation)
      // A more sophisticated spatial query would be better with PostGIS
      const { data, error } = await supabase
        .from('healthcare_facilities')
        .select('*')
        .eq('type', facilityType)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // Filter and format results
      return data.map(facility => {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          Number(facility.latitude), 
          Number(facility.longitude)
        );
        
        // Only include facilities within 10km
        if (distance > 10) return null;
        
        return {
          id: facility.id,
          name: facility.name,
          type: facility.type,
          distance: `${distance.toFixed(1)} km`,
          rating: facility.rating || 4.0,
          address: facility.address || 'Address not available',
          contact: facility.contact,
          website: facility.website,
          openNow: Math.random() > 0.3, // Simulating open status since we don't have real-time data
          imageUrl: facility.image_urls && facility.image_urls.length > 0 
            ? facility.image_urls[0] 
            : undefined
        };
      }).filter(Boolean) as Facility[];
      
    } catch (error) {
      console.error('Error searching database:', error);
      return [];
    }
  };

  const searchNearbyFacilities = async (
    latitude: number,
    longitude: number,
    type: string
  ): Promise<Facility[]> => {
    try {
      // Construct the Overpass API query
      // This example searches for hospitals, clinics, doctors, pharmacies based on the type filter
      const radius = 5000; // Search radius in meters (5km)
      let amenityType = 'hospital';
      
      switch (type) {
        case 'hospital':
          amenityType = 'hospital';
          break;
        case 'medical-store':
          amenityType = 'pharmacy';
          break;
        case 'pathology':
          amenityType = 'doctors';
          break;
        case 'clinic':
          amenityType = 'clinic';
          break;
        default:
          amenityType = 'hospital';
      }
      
      const overpassQuery = `
        [out:json];
        node["amenity"="${amenityType}"](around:${radius},${latitude},${longitude});
        out body;
      `;
      
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
      console.log('Overpass API response:', data);
      
      // Convert the Overpass API results to our Facility interface
      const facilities: Facility[] = data.elements.map((element: OverpassElement) => {
        // Calculate distance (simple approximation for now)
        const facilityLat = element.lat;
        const facilityLon = element.lon;
        const distance = calculateDistance(latitude, longitude, facilityLat, facilityLon);
        
        // Get a random image for the facility
        const imageId = getRandomImageId(amenityType);
        
        return {
          id: element.id.toString(),
          name: element.tags.name || `${amenityType.charAt(0).toUpperCase() + amenityType.slice(1)} Facility`,
          type: element.tags.amenity || amenityType,
          distance: `${distance.toFixed(1)} km`,
          rating: Math.floor(Math.random() * 50 + 30) / 10, // Random rating between 3.0 and 5.0
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street'] || ''}, ${element.tags['addr:city'] || ''}`
            : 'Address unavailable',
          contact: element.tags.phone,
          website: element.tags.website,
          openNow: element.tags.opening_hours ? !element.tags.opening_hours.includes('closed') : Math.random() > 0.3,
          imageUrl: `https://source.unsplash.com/${imageId}`
        };
      });
      
      return facilities;
    } catch (error) {
      console.error('Error searching nearby facilities:', error);
      throw error;
    }
  };

  const saveFacilitiesToDatabase = async (facilities: Facility[], latitude: number, longitude: number) => {
    if (!facilities.length) return;
    
    setIsSaving(true);
    toast({
      title: 'Saving Data',
      description: 'Saving facility information to our database...',
    });
    
    try {
      // Map facility data to database schema
      const facilitiesData = facilities.map(facility => {
        // Extract services from name and type
        const services = [facility.type];
        if (facility.name.toLowerCase().includes('emergency')) services.push('Emergency Care');
        if (facility.type === 'hospital') services.push('General Checkup');
        
        return {
          osm_id: facility.id,
          name: facility.name,
          type: facility.type,
          address: facility.address,
          latitude: parseFloat(facility.distance.split(' ')[0]) || 0,
          longitude: longitude,
          contact: facility.contact || null,
          website: facility.website || null,
          services: services,
          rating: facility.rating,
          image_urls: facility.imageUrl ? [facility.imageUrl] : [],
          district: 'Unknown', // We'd need to extract this from address
          state: 'Unknown', // We'd need to extract this from address
        };
      });
      
      // Insert into database
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

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const getRandomImageId = (facilityType: string): string => {
    const hospitalImages = ['y5hQCIn1C6o', 's4qDC1iSaTY', 'L4iI59WB4Yw', 'cGNCepznaV8'];
    const pharmacyImages = ['DPEPYPBZpfs', 'Vcm2lHXVz-o', '7jd3jKVEv3M', '2IBhAEtupH8'];
    
    const images = facilityType === 'pharmacy' ? pharmacyImages : hospitalImages;
    return images[Math.floor(Math.random() * images.length)];
  };

  return {
    facilities,
    isLoading,
    isSaving,
    searchFacilities,
  };
};
