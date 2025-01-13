import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for facilities
const mockFacilities = [
  {
    id: 1,
    name: "City General Hospital",
    type: "hospital",
    city: "New York",
    address: "123 Healthcare Ave",
    rating: 4.5,
    openNow: true,
    distance: "0.5 km",
    services: ["Emergency", "ICU", "Surgery"],
  },
  {
    id: 2,
    name: "Metro Medical Center",
    type: "hospital",
    city: "Los Angeles",
    address: "456 Medical Blvd",
    rating: 4.8,
    openNow: true,
    distance: "1.2 km",
    services: ["Cardiology", "Neurology", "Pediatrics"],
  },
  {
    id: 3,
    name: "Apollo Pharmacy",
    type: "pharmacy",
    city: "New York",
    address: "789 Health Street",
    rating: 4.6,
    openNow: true,
    distance: "0.3 km",
    services: ["24/7 Service", "Home Delivery", "Online Consultation"],
  },
  {
    id: 4,
    name: "LifeCare Diagnostics",
    type: "lab",
    city: "Los Angeles",
    address: "321 Lab Road",
    rating: 4.7,
    openNow: false,
    distance: "0.8 km",
    services: ["Blood Tests", "X-Ray", "MRI"],
  },
];

export const HospitalSearch = () => {
  const [searchCity, setSearchCity] = useState("");
  const [facilityType, setFacilityType] = useState("all");
  const [facilities, setFacilities] = useState(mockFacilities);

  const handleSearch = () => {
    // Filter facilities based on city and type
    const filtered = mockFacilities.filter((facility) => {
      const cityMatch = facility.city.toLowerCase().includes(searchCity.toLowerCase());
      const typeMatch = facilityType === "all" || facility.type === facilityType;
      return cityMatch && typeMatch;
    });
    setFacilities(filtered);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
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
            <SelectItem value="pharmacy">Pharmacies</SelectItem>
            <SelectItem value="lab">Labs</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Enter city name..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <p className="text-gray-600 capitalize">{facility.type}</p>
                <p className="text-gray-500 text-sm">{facility.address}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {facility.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">{facility.distance}</span>
                <div className="mt-1 flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{facility.rating}</span>
                </div>
                <span
                  className={`text-xs ${
                    facility.openNow ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {facility.openNow ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};