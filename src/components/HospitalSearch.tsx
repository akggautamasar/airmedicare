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
import { upMedicalFacilities, upDistricts, MedicalFacility } from "@/data/upMedicalFacilities";
import { AppointmentBooking } from "./AppointmentBooking";

export const HospitalSearch = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [facilityType, setFacilityType] = useState<string>("all");
  const [facilities, setFacilities] = useState<MedicalFacility[]>(upMedicalFacilities);

  const handleSearch = () => {
    const filtered = upMedicalFacilities.filter((facility) => {
      const districtMatch = selectedDistrict === "all" || facility.district.toLowerCase() === selectedDistrict.toLowerCase();
      const typeMatch = facilityType === "all" || facility.type === facilityType;
      return districtMatch && typeMatch;
    });
    setFacilities(filtered);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Find Healthcare Facilities in Uttar Pradesh</h2>
      
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

        <Button onClick={handleSearch} className="w-full sm:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 mb-4 rounded-md overflow-hidden">
              <img
                src={`https://source.unsplash.com/${facility.image}`}
                alt={facility.name}
                className="w-full h-full object-cover"
              />
              {facility.emergency && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  24/7 Emergency
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <div className="text-right">
                  <div className="flex items-center">
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

              <p className="text-gray-600 text-sm">{facility.address}</p>
              <p className="text-gray-600 text-sm">Contact: {facility.contact}</p>

              {facility.category && (
                <p className="text-sm">
                  <span className="font-medium">Category:</span>{" "}
                  {facility.category.charAt(0).toUpperCase() + facility.category.slice(1)}
                </p>
              )}

              {facility.doctors && facility.doctors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Doctors</h4>
                  <div className="space-y-2">
                    {facility.doctors.map((doctor, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-gray-600">{doctor.specialization}</p>
                        <p className="text-gray-500 text-xs">
                          Available: {doctor.availability.join(", ")}
                        </p>
                        <AppointmentBooking
                          doctorId={`${facility.id}-${index}`}
                          doctorName={doctor.name}
                          hospitalId={facility.id}
                          hospitalName={facility.name}
                          consultationFee={500} // Example fee
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};