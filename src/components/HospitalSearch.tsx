import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data for hospitals - replace with actual API call later
const mockHospitals = [
  {
    id: 1,
    name: "City General Hospital",
    city: "New York",
    address: "123 Healthcare Ave",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Metro Medical Center",
    city: "Los Angeles",
    address: "456 Medical Blvd",
    rating: 4.8,
  },
  // Add more mock hospitals as needed
];

export const HospitalSearch = () => {
  const [searchCity, setSearchCity] = useState("");
  const [hospitals, setHospitals] = useState(mockHospitals);

  const handleSearch = () => {
    // Filter hospitals based on city
    const filtered = mockHospitals.filter((hospital) =>
      hospital.city.toLowerCase().includes(searchCity.toLowerCase())
    );
    setHospitals(filtered);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-6">
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

      <div className="grid gap-4 md:grid-cols-2">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold">{hospital.name}</h3>
            <p className="text-gray-600">{hospital.city}</p>
            <p className="text-gray-500 text-sm">{hospital.address}</p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{hospital.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};