
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { indianStates } from '@/data/indianStates';

export function DataCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('');
  const [totalFacilities, setTotalFacilities] = useState(0);
  const [savedFacilities, setSavedFacilities] = useState(0);
  const { toast } = useToast();

  const collectData = async () => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    setProgress(0);
    setTotalFacilities(0);
    setSavedFacilities(0);
    
    try {
      let totalDistricts = 0;
      let processedDistricts = 0;
      
      // Count total districts for progress calculation
      indianStates.forEach(state => {
        totalDistricts += state.districts.length;
      });
      
      toast({
        title: 'Data Collection Started',
        description: `Processing ${totalDistricts} districts across India`,
      });
      
      for (const state of indianStates) {
        for (const district of state.districts) {
          setCurrentLocation(`${district.name}, ${state.name}`);
          setProgress(Math.floor((processedDistricts / totalDistricts) * 100));
          
          try {
            await collectFacilitiesForDistrict(state.code, state.name, district.code, district.name);
            processedDistricts++;
          } catch (error) {
            console.error(`Error collecting data for ${district.name}, ${state.name}:`, error);
            // Continue with next district
          }
          
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setProgress(100);
      toast({
        title: 'Data Collection Complete',
        description: `Saved ${savedFacilities} facilities across India`,
      });
    } catch (error) {
      console.error('Error in data collection:', error);
      toast({
        title: 'Data Collection Error',
        description: 'An error occurred during data collection.',
        variant: 'destructive',
      });
    } finally {
      setIsCollecting(false);
    }
  };
  
  const collectFacilitiesForDistrict = async (
    stateCode: string,
    stateName: string,
    districtCode: string,
    districtName: string
  ) => {
    try {
      // Get coordinates for the district
      const location = await geocodeLocation(`${districtName}, ${stateName}, India`);
      if (!location) {
        console.error(`Could not geocode location for ${districtName}, ${stateName}`);
        return;
      }
      
      // Define facility types to collect
      const facilityTypes = ['hospital', 'pharmacy', 'doctors', 'clinic', 'laboratory'];
      
      for (const facilityType of facilityTypes) {
        const facilities = await searchOpenStreetMap(location.lat, location.lon, facilityType);
        
        if (facilities.length > 0) {
          await saveFacilitiesToDatabase(facilities, location.lat, location.lon, districtName, stateName);
          setTotalFacilities(prev => prev + facilities.length);
          setSavedFacilities(prev => prev + facilities.length);
        }
      }
    } catch (error) {
      console.error(`Error collecting facilities for ${districtName}:`, error);
      throw error; // Propagate the error
    }
  };
  
  const geocodeLocation = async (query: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`,
        {
          headers: {
            'User-Agent': 'HealthcareApp/1.0',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to geocode location');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  };
  
  const searchOpenStreetMap = async (latitude: number, longitude: number, facilityType: string): Promise<any[]> => {
    try {
      const radius = 10000; // 10km radius
      let amenityType = facilityType;
      
      // Map our facility types to OSM amenity types
      if (facilityType === 'medical-store') amenityType = 'pharmacy';
      if (facilityType === 'pathology') amenityType = 'doctors|laboratory';
      
      const overpassQuery = `
        [out:json];
        node["amenity"~"${amenityType}"](around:${radius},${latitude},${longitude});
        out body;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'HealthcareApp/1.0',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to search OpenStreetMap');
      }
      
      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      console.error('Error searching OpenStreetMap:', error);
      return [];
    }
  };
  
  const saveFacilitiesToDatabase = async (
    facilities: any[],
    latitude: number,
    longitude: number,
    district: string,
    state: string
  ) => {
    if (!facilities.length) return;
    
    try {
      // Get image URLs for facilities by type
      const getImageForType = (type: string): string => {
        const hospitalImages = ['y5hQCIn1C6o', 's4qDC1iSaTY', 'L4iI59WB4Yw', 'cGNCepznaV8'];
        const pharmacyImages = ['DPEPYPBZpfs', 'Vcm2lHXVz-o', '7jd3jKVEv3M', '2IBhAEtupH8'];
        const labImages = ['nOVQ8Gj1i8E', 'L8tWZT4CcVQ', '66JMmdEIn9E', 'HJckKnwCXxQ'];
        
        if (type === 'pharmacy') {
          return `https://source.unsplash.com/${pharmacyImages[Math.floor(Math.random() * pharmacyImages.length)]}`;
        } else if (type === 'laboratory' || type === 'doctors') {
          return `https://source.unsplash.com/${labImages[Math.floor(Math.random() * labImages.length)]}`;
        } else {
          return `https://source.unsplash.com/${hospitalImages[Math.floor(Math.random() * hospitalImages.length)]}`;
        }
      };
      
      // Map OSM data to our database schema
      const facilitiesData = facilities.map(element => {
        const facilityType = element.tags?.amenity || 'hospital';
        
        // Extract services based on facility type and tags
        const services = [facilityType];
        if (element.tags.emergency === 'yes') services.push('Emergency Care');
        if (facilityType === 'hospital') services.push('General Checkup');
        if (element.tags.healthcare === 'laboratory') services.push('Laboratory Services');
        
        // Extract address components
        const address = element.tags['addr:street'] 
          ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street'] || ''}, ${element.tags['addr:city'] || ''}`
          : 'Address unavailable';
        
        // Generate a rating between 3.0 and 5.0
        const rating = Math.floor(Math.random() * 20 + 30) / 10;
        
        return {
          osm_id: element.id.toString(),
          name: element.tags.name || `${facilityType.charAt(0).toUpperCase() + facilityType.slice(1)} Facility`,
          type: facilityType,
          address: address,
          latitude: element.lat,
          longitude: element.lon,
          contact: element.tags.phone || element.tags['contact:phone'] || null,
          website: element.tags.website || null,
          services: services,
          rating: rating,
          image_urls: [getImageForType(facilityType)],
          district: element.tags['addr:district'] || element.tags['addr:city'] || district,
          state: state,
        };
      });
      
      // Insert into database with upsert to avoid duplicates
      const { error } = await supabase
        .from('healthcare_facilities')
        .upsert(facilitiesData, { 
          onConflict: 'osm_id',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving facilities to database:', error);
      throw error;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Data Collection Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button 
            onClick={collectData} 
            disabled={isCollecting}
            className="w-full"
          >
            {isCollecting ? 'Collecting Data...' : 'Collect All Healthcare Facilities Data'}
          </Button>
          
          {isCollecting && (
            <>
              <Progress value={progress} className="w-full h-2" />
              <div className="text-sm text-gray-500">
                <p>Current Location: {currentLocation}</p>
                <p>Facilities Found: {totalFacilities}</p>
                <p>Facilities Saved: {savedFacilities}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
