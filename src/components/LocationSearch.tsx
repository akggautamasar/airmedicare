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

const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
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

export const LocationSearch = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityType, setFacilityType] = useState('hospital');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          const address = await reverseGeocode(latitude, longitude);
          setUserLocation({ latitude, longitude, address });
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Please enter it manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      return data.features[0]?.place_name;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return '';
    }
  };

  // Mock data - Replace with actual API call in production
  const searchFacilities = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockFacilities: Facility[] = [
      {
        id: '1',
        name: 'City General Hospital',
        type: 'hospital',
        distance: '0.5 km',
        rating: 4.5,
        address: '123 Healthcare Ave',
        openNow: true,
      },
      {
        id: '2',
        name: 'MediCare Pharmacy',
        type: 'medical-store',
        distance: '0.8 km',
        rating: 4.2,
        address: '456 Pharma Street',
        openNow: true,
      },
      {
        id: '3',
        name: 'LifeCare Diagnostics',
        type: 'pathology',
        distance: '1.2 km',
        rating: 4.7,
        address: '789 Lab Road',
        openNow: false,
      },
    ];

    setFacilities(mockFacilities);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-medical-primary" />
          <span className="text-gray-600">
            {userLocation?.address || 'Detecting location...'}
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

        <div className="flex gap-2">
          <Select
            value={facilityType}
            onValueChange={setFacilityType}
          >
            <SelectTrigger className="w-[200px]">
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