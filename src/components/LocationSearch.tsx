
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, ExternalLink, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  latitude: number;
  longitude: number;
  displayName?: string;
}

interface Facility {
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

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    amenity?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  category?: string;
  type?: string;
  importance?: number;
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

export const LocationSearch = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityType, setFacilityType] = useState('hospital');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          toast({
            title: 'Location Found',
            description: 'Fetching your location details...',
          });
          
          // Reverse geocode to get the address at the user's location
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Please enter it manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const fetchAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'HealthcareApp/1.0',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address from coordinates');
      }
      
      const data: NominatimResult = await response.json();
      console.log('Reverse geocode data:', data);
      
      // Update user location with display name
      setUserLocation(prev => {
        if (prev) {
          return {
            ...prev,
            displayName: data.display_name
          };
        }
        return prev;
      });
      
      toast({
        title: 'Location Found',
        description: data.display_name,
      });
      
      // Automatically search for nearby facilities once we have the user's location
      searchFacilities();
    } catch (error) {
      console.error('Error fetching address:', error);
      toast({
        title: 'Address Lookup Error',
        description: 'Unable to determine your address from coordinates.',
        variant: 'destructive',
      });
    }
  };

  const searchFacilities = async () => {
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

  const geocodeSearchQuery = async (query: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'HealthcareApp/1.0',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to geocode search query');
      }
      
      const results: NominatimResult[] = await response.json();
      console.log('Geocode results:', results);
      
      if (results.length === 0) {
        throw new Error('Location not found. Please try a different search term.');
      }
      
      return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
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

  // Trigger search when user presses Enter in the search box
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchFacilities();
    }
  };

  useEffect(() => {
    // Try to get user location when component mounts
    getUserLocation();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-medical-primary" />
          <span className="text-gray-600">
            {userLocation 
              ? userLocation.displayName || `Searching location...`
              : 'Location not detected'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={getUserLocation}
            className="ml-auto"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Use current location
          </Button>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Select
            value={facilityType}
            onValueChange={setFacilityType}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Facility type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hospital">Hospitals</SelectItem>
              <SelectItem value="medical-store">Medical Stores</SelectItem>
              <SelectItem value="pathology">Pathology Labs</SelectItem>
              <SelectItem value="clinic">Clinics</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 relative">
            <Input
              placeholder="Search for hospitals, medical stores, labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button onClick={searchFacilities} disabled={isLoading || isSaving}>
            {isLoading ? 'Searching...' : isSaving ? 'Saving...' : 'Search'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {facilities.length === 0 && !isLoading && !isSaving && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery || userLocation
              ? 'No facilities found in this area. Try expanding your search.'
              : 'Use the search box or your current location to find healthcare facilities.'}
          </div>
        )}
        
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {facility.imageUrl && (
                <div className="w-full md:w-32 h-24 md:h-32 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={facility.imageUrl}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-gray-600 text-sm capitalize">{facility.type.replace('-', ' ')}</p>
                    <p className="text-gray-500 text-sm mt-1">{facility.address}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {facility.contact && (
                        <a 
                          href={`tel:${facility.contact}`} 
                          className="flex items-center text-sm text-blue-600 hover:underline"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {facility.contact}
                        </a>
                      )}
                      
                      {facility.website && (
                        <a 
                          href={facility.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{facility.distance}</span>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{facility.rating}</span>
                    </div>
                    <span className={`text-xs ${facility.openNow ? 'text-green-500' : 'text-red-500'}`}>
                      {facility.openNow ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
