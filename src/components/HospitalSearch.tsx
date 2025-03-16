import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Navigation } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upDistricts } from "@/data/upMedicalFacilities";
import { AppointmentBooking } from "./AppointmentBooking";
import { useToast } from "./ui/use-toast";

interface Location {
  latitude: number;
  longitude: number;
}

interface Doctor {
  name: string;
  specialization: string;
  availability: string[];
}

interface Facility {
  id: string;
  name: string;
  type: string;
  district: string;
  address: string;
  contact: string;
  rating: number;
  emergency: boolean;
  openNow: boolean;
  image: string;
  services: string[];
  category?: string;
  doctors?: Doctor[];
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    state?: string;
    city?: string;
    town?: string;
    county?: string;
    state_district?: string;
  };
}

export const HospitalSearch = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [facilityType, setFacilityType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          toast({
            title: "Location Found",
            description: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
          
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please select a district manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
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
      
      if (!response.ok) throw new Error("Failed to fetch location data");
      
      const data: NominatimResult = await response.json();
      console.log("Reverse geocode data:", data);
      
      const district = data.address.county || 
                       data.address.state_district || 
                       data.address.city || 
                       data.address.town || 
                       "";
                       
      if (district) {
        const matchedDistrict = upDistricts.find(d => 
          district.toLowerCase().includes(d.toLowerCase()) || 
          d.toLowerCase().includes(district.toLowerCase())
        );
        
        if (matchedDistrict) {
          setSelectedDistrict(matchedDistrict);
          toast({
            title: "District Found",
            description: `You appear to be in or near ${matchedDistrict}`,
          });
        }
      }
      
      handleSearch();
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      
      const amenities = facilityType === "all" 
        ? "hospital|clinic|doctors|pharmacy" 
        : facilityType === "hospital" 
          ? "hospital|clinic" 
          : facilityType === "medical-store" 
            ? "pharmacy" 
            : "doctors";
      
      let latitude, longitude;
      let searchArea = "";
      
      if (selectedDistrict !== "all") {
        searchArea = `${selectedDistrict}, Uttar Pradesh, India`;
        const geocodeResult = await geocodeDistrict(searchArea);
        if (geocodeResult) {
          latitude = geocodeResult.lat;
          longitude = geocodeResult.lon;
        }
      } 
      else if (userLocation) {
        latitude = userLocation.latitude;
        longitude = userLocation.longitude;
      } else {
        latitude = 26.8467;
        longitude = 80.9462;
        searchArea = "Uttar Pradesh, India";
      }
      
      const radius = 20000;
      const overpassQuery = `
        [out:json];
        (
          node["amenity"~"${amenities}"](around:${radius},${latitude},${longitude});
          way["amenity"~"${amenities}"](around:${radius},${latitude},${longitude});
          relation["amenity"~"${amenities}"](around:${radius},${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'HealthcareApp/1.0',
        },
      });
      
      if (!response.ok) throw new Error('Failed to search for facilities');
      
      const data = await response.json();
      console.log('Overpass API response:', data);
      
      const processedFacilities = processOverpassResults(data, latitude, longitude);
      setFacilities(processedFacilities);
      
      if (processedFacilities.length === 0) {
        toast({
          title: "No Results",
          description: "No healthcare facilities found with the current filters. Try broadening your search.",
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: error.message || "Failed to search for healthcare facilities.",
        variant: "destructive",
      });
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const geocodeDistrict = async (district: string): Promise<{lat: number, lon: number} | null> => {
    try {
      const query = encodeURIComponent(`${district}, Uttar Pradesh, India`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'HealthcareApp/1.0',
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to geocode district");
      
      const results: NominatimResult[] = await response.json();
      
      if (results.length === 0) {
        toast({
          title: "Geocoding Error",
          description: `Could not find coordinates for ${district}`,
          variant: "destructive",
        });
        return null;
      }
      
      return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
      };
    } catch (error) {
      console.error("Error geocoding district:", error);
      return null;
    }
  };

  const processOverpassResults = (data: any, centerLat: number, centerLon: number): Facility[] => {
    const nodes = data.elements.filter((e: any) => e.type === 'node');
    
    return nodes.map((node: any, index: number) => {
      const distance = calculateDistance(
        centerLat, 
        centerLon,
        node.lat,
        node.lon
      );
      
      const amenityType = node.tags?.amenity || '';
      let facilityType = 'hospital';
      
      if (amenityType.includes('pharmacy')) {
        facilityType = 'medical-store';
      } else if (amenityType.includes('doctors')) {
        facilityType = 'pathology-lab';
      } else {
        facilityType = 'hospital';
      }
      
      const sampleDoctors: Doctor[] = [];
      if (facilityType === 'hospital' || facilityType === 'clinic') {
        const specializations = [
          'Cardiologist', 'Neurologist', 'Orthopedic', 'Pediatrician',
          'Dermatologist', 'Gynecologist', 'General Physician', 'ENT Specialist'
        ];
        
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        const doctorCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < doctorCount; i++) {
          const specialization = specializations[Math.floor(Math.random() * specializations.length)];
          const availabilityCount = Math.floor(Math.random() * 4) + 2;
          const availability: string[] = [];
          
          for (let j = 0; j < availabilityCount; j++) {
            const day = days[Math.floor(Math.random() * days.length)];
            if (!availability.includes(day)) {
              availability.push(day);
            }
          }
          
          sampleDoctors.push({
            name: `Dr. ${['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta'][Math.floor(Math.random() * 5)]}`,
            specialization,
            availability: availability.sort((a, b) => days.indexOf(a) - days.indexOf(b)),
          });
        }
      }
      
      const nodeDistrict = node.tags?.['addr:district'] || node.tags?.['addr:city'] || selectedDistrict;
      
      const services = [
        'Emergency Care', 'Ambulance', 'Laboratory', 'X-Ray', 
        'CT Scan', 'MRI', 'Ultrasound', 'Pharmacy', 'Blood Bank'
      ].filter(() => Math.random() > 0.5);
      
      return {
        id: node.id.toString(),
        name: node.tags?.name || node.tags?.['name:en'] || `Healthcare Facility ${index + 1}`,
        type: facilityType,
        district: nodeDistrict === 'all' ? 'Uttar Pradesh' : nodeDistrict,
        address: node.tags?.['addr:full'] || 
                  `${node.tags?.['addr:street'] || ''} ${node.tags?.['addr:housenumber'] || ''}`.trim() ||
                  node.tags?.address ||
                  `${distance.toFixed(2)} km from center`,
        contact: node.tags?.phone || node.tags?.['contact:phone'] || '123-456-7890',
        rating: (Math.random() * 2 + 3).toFixed(1),
        emergency: node.tags?.emergency === 'yes' || Math.random() > 0.7,
        openNow: Math.random() > 0.3,
        image: generateRandomImageId(),
        services: services.length > 0 ? services : ['General Checkup'],
        category: ['general', 'specialty', 'super-specialty'][Math.floor(Math.random() * 3)],
        doctors: sampleDoctors.length > 0 ? sampleDoctors : undefined,
      };
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const generateRandomImageId = (): string => {
    const imageIds = [
      '2IBhAEtupH8', 'y5hQCIn1C6o', 's4qDC1iSaTY', 'Vcm2lHXVz-o',
      '7jd3jKVEv3M', 'DPEPYPBZpfs', 'L4iI59WB4Yw', 'cGNCepznaV8'
    ];
    return imageIds[Math.floor(Math.random() * imageIds.length)];
  };

  useEffect(() => {
    handleSearch();
  }, []);

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

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-gray-600">Searching for healthcare facilities...</p>
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No healthcare facilities found. Try changing your search criteria.</p>
        </div>
      ) : (
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
                            consultationFee={500}
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
      )}
    </div>
  );
};
