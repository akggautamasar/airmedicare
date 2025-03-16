
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Location {
  latitude: number;
  longitude: number;
  displayName?: string;
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

export const useLocationSearch = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
    } catch (error) {
      console.error('Error fetching address:', error);
      toast({
        title: 'Address Lookup Error',
        description: 'Unable to determine your address from coordinates.',
        variant: 'destructive',
      });
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

  useEffect(() => {
    // Try to get user location when component mounts
    getUserLocation();
  }, []);

  return {
    userLocation,
    searchQuery,
    setSearchQuery,
    getUserLocation,
    geocodeSearchQuery,
  };
};
