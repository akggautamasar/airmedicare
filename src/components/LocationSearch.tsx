
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
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
  openNow: boolean;
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

export const LocationSearch = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityType, setFacilityType] = useState('hospital');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Now search for facilities near the determined location
      const nearbyFacilities = await searchNearbyFacilities(
        searchLocation.lat,
        searchLocation.lon,
        facilityType
      );
      
      setFacilities(nearbyFacilities);
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
      const facilities: Facility[] = data.elements.map((element: any, index: number) => {
        // Calculate distance (simple approximation for now)
        const facilityLat = element.lat;
        const facilityLon = element.lon;
        const distance = calculateDistance(latitude, longitude, facilityLat, facilityLon);
        
        return {
          id: element.id.toString(),
          name: element.tags.name || `${amenityType.charAt(0).toUpperCase() + amenityType.slice(1)} ${index + 1}`,
          type: element.tags.amenity || amenityType,
          distance: `${distance.toFixed(1)} km`,
          rating: Math.floor(Math.random() * 50 + 30) / 10, // Random rating between 3.0 and 5.0
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street'] || ''}, ${element.tags['addr:city'] || ''}`
            : element.tags.description || 'Address unavailable',
          openNow: Math.random() > 0.3, // Randomly determine if open (70% chance of being open)
        };
      });
      
      return facilities;
    } catch (error) {
      console.error('Error searching nearby facilities:', error);
      throw error;
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

  // Trigger search when user presses Enter in the search box
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchFacilities();
    }
  };

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
          <Button onClick={searchFacilities} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {facilities.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery || userLocation
              ? 'No facilities found in this area. Try expanding your search.'
              : 'Use the search box or your current location to find healthcare facilities.'}
          </div>
        )}
        
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{facility.name}</h3>
                <p className="text-gray-600 text-sm">{facility.type}</p>
                <p className="text-gray-500 text-sm mt-1">{facility.address}</p>
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
        ))}
      </div>
    </div>
  );
};
