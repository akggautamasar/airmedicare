
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Doctor {
  name: string;
  specialization: string;
  availability: string[];
}

export interface Facility {
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

export const useHospitalFacilityData = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const processOverpassResults = (data: any, centerLat: number, centerLon: number, selectedDistrict: string): Facility[] => {
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

  const handleSearch = async (
    facilityType: string,
    selectedDistrict: string,
    searchQuery: string,
    userLocation: { latitude: number, longitude: number } | null,
    geocodeDistrict: (district: string) => Promise<{lat: number, lon: number} | null>,
    selectedState?: string
  ) => {
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
      
      const processedFacilities = processOverpassResults(data, latitude, longitude, selectedDistrict);
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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
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

  return {
    facilities,
    isLoading,
    handleSearch,
  };
};
