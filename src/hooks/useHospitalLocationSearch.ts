
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { upDistricts } from "@/data/upMedicalFacilities";

interface Location {
  latitude: number;
  longitude: number;
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

export const useHospitalLocationSearch = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
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
    } else {
      toast({
        title: "Geolocation Unavailable",
        description: "Your browser doesn't support geolocation. Please select location manually.",
        variant: "destructive",
      });
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
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  const geocodeDistrict = async (district: string): Promise<{lat: number, lon: number} | null> => {
    if (district === "all") {
      // Default to center of UP if no specific district
      return { lat: 26.8467, lon: 80.9462 };
    }
    
    try {
      // Format query with state information if possible
      let query = district;
      if (!district.toLowerCase().includes("uttar pradesh") && 
          !district.toLowerCase().includes("delhi") &&
          !district.toLowerCase().includes("maharashtra")) {
        query = `${district}, Uttar Pradesh, India`;
      } else {
        query = `${district}, India`;
      }
      
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`,
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

  return {
    selectedDistrict,
    setSelectedDistrict,
    userLocation,
    setUserLocation,
    getUserLocation,
    reverseGeocode,
    geocodeDistrict
  };
};
