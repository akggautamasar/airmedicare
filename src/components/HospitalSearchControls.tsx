
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upDistricts } from "@/data/upMedicalFacilities";

interface HospitalSearchControlsProps {
  facilityType: string;
  setFacilityType: (value: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  getUserLocation: () => void;
  handleSearch: () => void;
  isLoading: boolean;
}

export const HospitalSearchControls = ({
  facilityType,
  setFacilityType,
  selectedDistrict,
  setSelectedDistrict,
  searchQuery,
  setSearchQuery,
  getUserLocation,
  handleSearch,
  isLoading
}: HospitalSearchControlsProps) => {
  return (
    <div className="flex gap-2 mb-6 flex-col sm:flex-row">
      <Select
        value={facilityType}
        onValueChange={setFacilityType}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Facility type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Facilities</SelectItem>
          <SelectItem value="hospital">Hospitals</SelectItem>
          <SelectItem value="medical-store">Medical Stores</SelectItem>
          <SelectItem value="pathology-lab">Pathology Labs</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={selectedDistrict}
        onValueChange={setSelectedDistrict}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Select District" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Districts</SelectItem>
          {upDistricts.map((district) => (
            <SelectItem key={district} value={district}>
              {district.charAt(0).toUpperCase() + district.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 flex-1">
        <Input
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <Button 
          onClick={getUserLocation}
          variant="outline"
          className="whitespace-nowrap"
        >
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
        
        <Button onClick={handleSearch} className="whitespace-nowrap" disabled={isLoading}>
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
};
