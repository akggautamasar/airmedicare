
import { useState } from 'react';
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

interface SearchControlsProps {
  userLocation: { latitude: number; longitude: number; displayName?: string } | null;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onGetUserLocation: () => void;
  onSearchFacilities: () => void;
  isLoading: boolean;
  isSaving: boolean;
  facilityType: string;
  onFacilityTypeChange: (type: string) => void;
}

export const SearchControls = ({
  userLocation,
  searchQuery,
  onSearchQueryChange,
  onGetUserLocation,
  onSearchFacilities,
  isLoading,
  isSaving,
  facilityType,
  onFacilityTypeChange,
}: SearchControlsProps) => {
  // Handle key press in search box
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchFacilities();
    }
  };

  return (
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
          onClick={onGetUserLocation}
          className="ml-auto"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Use current location
        </Button>
      </div>

      <div className="flex gap-2 flex-col sm:flex-row">
        <Select
          value={facilityType}
          onValueChange={onFacilityTypeChange}
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
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button onClick={onSearchFacilities} disabled={isLoading || isSaving}>
          {isLoading ? 'Searching...' : isSaving ? 'Saving...' : 'Search'}
        </Button>
      </div>
    </div>
  );
};
