
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { indianStates, State } from "@/data/indianStates";

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
  const [searchMethod, setSearchMethod] = useState<"location" | "stateDistrict">("location");
  const [selectedState, setSelectedState] = useState<string>("UP");

  // Get districts for selected state
  const getDistrictsForState = (stateCode: string) => {
    const state = indianStates.find(s => s.code === stateCode);
    return state ? state.districts : [];
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedDistrict("all"); // Reset district when state changes
  };
  
  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrict(districtCode);
  };

  const onSearch = () => {
    handleSearch();
  };

  return (
    <div className="space-y-4">
      <Tabs value={searchMethod} onValueChange={(v) => setSearchMethod(v as "location" | "stateDistrict")} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="location" className="flex-1">
            <MapPin className="h-4 w-4 mr-2" />
            Search by Your Location
          </TabsTrigger>
          <TabsTrigger value="stateDistrict" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search by State & District
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="location" className="space-y-4">
          <div className="flex gap-2 mb-6 flex-col sm:flex-row">
            <div className="w-full sm:w-[200px] relative">
              <Select
                value={facilityType}
                onValueChange={setFacilityType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Facility type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 max-h-[300px] overflow-y-auto">
                  <SelectItem value="all">All Facilities</SelectItem>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="medical-store">Medical Stores</SelectItem>
                  <SelectItem value="pathology-lab">Pathology Labs</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              
              <Button onClick={onSearch} className="whitespace-nowrap" disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stateDistrict" className="space-y-4">
          <div className="flex gap-2 mb-6 flex-col sm:flex-row">
            <div className="w-full sm:w-[200px] relative">
              <Select
                value={facilityType}
                onValueChange={setFacilityType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Facility type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 max-h-[300px] overflow-y-auto">
                  <SelectItem value="all">All Facilities</SelectItem>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="medical-store">Medical Stores</SelectItem>
                  <SelectItem value="pathology-lab">Pathology Labs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[200px] relative">
              <Select
                value={selectedState}
                onValueChange={handleStateChange}
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
                onValueChange={handleDistrictChange}
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

            <Button onClick={onSearch} className="whitespace-nowrap" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
