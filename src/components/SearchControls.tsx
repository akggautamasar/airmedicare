
import { useState } from 'react';
import { Search, MapPin, Navigation, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { indianStates } from '@/data/indianStates';

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
  const [searchMethod, setSearchMethod] = useState<"location" | "stateDistrict">("location");
  const [selectedState, setSelectedState] = useState<string>("UP");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  // Handle key press in search box
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchFacilities();
    }
  };

  // Get districts for selected state
  const getDistrictsForState = (stateCode: string) => {
    const state = indianStates.find(s => s.code === stateCode);
    return state ? state.districts : [];
  };

  return (
    <div className="mb-8 space-y-4">
      <Tabs value={searchMethod} onValueChange={(v) => setSearchMethod(v as "location" | "stateDistrict")} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="location" className="flex-1">
            <MapPin className="h-4 w-4 mr-2" />
            Search by Your Location
          </TabsTrigger>
          <TabsTrigger value="stateDistrict" className="flex-1">
            <Globe className="h-4 w-4 mr-2" />
            Search by State & District
          </TabsTrigger>
        </TabsList>

        <TabsContent value="location" className="space-y-4">
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
            <div className="w-full sm:w-[200px] relative">
              <Select
                value={facilityType}
                onValueChange={onFacilityTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Facility type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 absolute max-h-[300px] overflow-y-auto">
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="medical-store">Medical Stores</SelectItem>
                  <SelectItem value="pathology">Pathology Labs</SelectItem>
                  <SelectItem value="clinic">Clinics</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        </TabsContent>

        <TabsContent value="stateDistrict" className="space-y-4">
          <div className="flex gap-2 mb-4 flex-col sm:flex-row">
            <div className="w-full sm:w-[200px] relative">
              <Select
                value={facilityType}
                onValueChange={onFacilityTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Facility type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 absolute max-h-[300px] overflow-y-auto">
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="medical-store">Medical Stores</SelectItem>
                  <SelectItem value="pathology">Pathology Labs</SelectItem>
                  <SelectItem value="clinic">Clinics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[200px] relative">
              <Select
                value={selectedState}
                onValueChange={setSelectedState}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-white z-40 max-h-[300px] overflow-y-auto">
                  {indianStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[200px] relative">
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent className="bg-white z-30 max-h-[300px] overflow-y-auto">
                  <SelectItem value="all">All Districts</SelectItem>
                  {getDistrictsForState(selectedState).map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={onSearchFacilities} disabled={isLoading || isSaving}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Searching...' : isSaving ? 'Saving...' : 'Search'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
