
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { indianStates } from "@/data/indianStates";

interface Location {
  latitude: number;
  longitude: number;
  displayName?: string;
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
  const [selectedState, setSelectedState] = useState<string>("UP");
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
        // Search through all states and districts
        for (const state of indianStates) {
          const matchedDistrict = state.districts.find(d => 
            district.toLowerCase().includes(d.name.toLowerCase()) || 
            d.name.toLowerCase().includes(district.toLowerCase())
          );
          
          if (matchedDistrict) {
            setSelectedState(state.code);
            setSelectedDistrict(matchedDistrict.code);
            toast({
              title: "District Found",
              description: `You appear to be in or near ${matchedDistrict.name}, ${state.name}`,
            });
            return;
          }
        }
      }
      
      // If no match found
      toast({
        title: "Location Found",
        description: "Could not match to a specific district. Please select manually.",
      });
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  const geocodeDistrict = async (district: string): Promise<{lat: number, lon: number, displayName?: string} | null> => {
    if (district === "all" && selectedState !== "all") {
      // Try to geocode the state if no specific district
      const state = indianStates.find(s => s.code === selectedState);
      if (state) {
        const stateQuery = `${state.name}, India`;
        try {
          const encodedQuery = encodeURIComponent(stateQuery);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'HealthcareApp/1.0',
              },
            }
          );
          
          if (!response.ok) throw new Error("Failed to geocode state");
          
          const results: NominatimResult[] = await response.json();
          
          if (results.length > 0) {
            return {
              lat: parseFloat(results[0].lat),
              lon: parseFloat(results[0].lon),
              displayName: results[0].display_name
            };
          }
        } catch (error) {
          console.error("Error geocoding state:", error);
        }
      }
      
      // Default to center of India if state geocoding fails
      return { lat: 20.5937, lon: 78.9629 };
    }
    
    if (district === "all" && selectedState === "all") {
      // Default to center of India if no specific state or district
      return { lat: 20.5937, lon: 78.9629 };
    }
    
    try {
      // Find the district information
      let districtName = "";
      let stateName = "";
      
      for (const state of indianStates) {
        const matchedDistrict = state.districts.find(d => d.code === district);
        if (matchedDistrict) {
          districtName = matchedDistrict.name;
          stateName = state.name;
          break;
        }
      }
      
      // Format query with state information if possible
      let query = district;
      if (districtName && stateName) {
        query = `${districtName}, ${stateName}, India`;
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
          description: `Could not find coordinates for ${districtName || district}`,
          variant: "destructive",
        });
        return null;
      }
      
      return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
        displayName: results[0].display_name
      };
    } catch (error) {
      console.error("Error geocoding district:", error);
      return null;
    }
  };

  return {
    selectedDistrict,
    setSelectedDistrict,
    selectedState,
    setSelectedState,
    userLocation,
    setUserLocation,
    getUserLocation,
    reverseGeocode,
    geocodeDistrict
  };
};
