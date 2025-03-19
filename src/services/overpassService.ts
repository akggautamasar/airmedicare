
import { calculateDistance, getRandomImageId } from '@/utils/facilityUtils';
import { Facility, OverpassElement } from '@/types/facility';

export const searchNearbyFacilities = async (
  latitude: number,
  longitude: number,
  type: string,
  selectedState?: string,
  selectedDistrict?: string,
  districtName?: string,
  stateName?: string
): Promise<Facility[]> => {
  try {
    const radius = 10000;
    let amenityType = 'hospital';
    
    switch (type) {
      case 'hospital':
        amenityType = 'hospital';
        break;
      case 'medical-store':
        amenityType = 'pharmacy';
        break;
      case 'pathology':
        amenityType = 'doctors|laboratory';
        break;
      case 'clinic':
        amenityType = 'clinic';
        break;
      case 'all':
        amenityType = 'hospital|pharmacy|doctors|clinic|laboratory';
        break;
      default:
        amenityType = 'hospital';
    }
    
    let overpassQuery = '';
    if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
      // District-specific query
      overpassQuery = `
        [out:json];
        area[name~"${districtName}"]->.searchArea;
        node["amenity"~"${amenityType}"](area.searchArea);
        out body;
      `;
    } else if (selectedState && selectedState !== 'all' && stateName) {
      // State-specific query
      overpassQuery = `
        [out:json];
        area[name~"${stateName}"]->.searchArea;
        node["amenity"~"${amenityType}"](area.searchArea);
        out body;
      `;
    } else {
      // Radius-based query
      overpassQuery = `
        [out:json];
        node["amenity"~"${amenityType}"](around:${radius},${latitude},${longitude});
        out body;
      `;
    }
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'HealthcareApp/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to search for nearby facilities');
    }
    
    const data = await response.json();
    console.log(`🌍 Overpass API found ${data.elements?.length || 0} facilities`);
    
    if (!data.elements || data.elements.length === 0) {
      console.log('⚠️ No results from OpenStreetMap API');
      if ((selectedDistrict && selectedDistrict !== 'all') || (selectedState && selectedState !== 'all')) {
        console.log('🔄 Trying fallback radius-based search');
        const fallbackQuery = `
          [out:json];
          node["amenity"~"${amenityType}"](around:${radius},${latitude},${longitude});
          out body;
        `;
        
        const fallbackResponse = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: fallbackQuery,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'HealthcareApp/1.0',
          },
        });
        
        if (!fallbackResponse.ok) {
          return [];
        }
        
        const fallbackData = await fallbackResponse.json();
        data.elements = fallbackData.elements || [];
      } else {
        return [];
      }
    }
    
    const allFacilities: Facility[] = data.elements.map((element: OverpassElement) => {
      const facilityLat = element.lat;
      const facilityLon = element.lon;
      const distance = calculateDistance(latitude, longitude, facilityLat, facilityLon);
      
      const imageId = getRandomImageId(element.tags?.amenity || amenityType);
      
      const facilityDistrict = element.tags?.['addr:district'] || 
                            element.tags?.['addr:city'] || 
                            districtName || 
                            'Unknown';
      
      return {
        id: element.id.toString(),
        name: element.tags?.name || `${element.tags?.amenity ? element.tags.amenity.charAt(0).toUpperCase() + element.tags.amenity.slice(1) : 'Healthcare'} Facility`,
        type: element.tags?.amenity || amenityType,
        distance: `${distance.toFixed(1)} km`,
        rating: Math.floor(Math.random() * 50 + 30) / 10,
        address: element.tags?.['addr:street'] 
          ? `${element.tags?.['addr:housenumber'] || ''} ${element.tags?.['addr:street'] || ''}, ${element.tags?.['addr:city'] || ''}`
          : 'Address unavailable',
        contact: element.tags?.phone,
        website: element.tags?.website,
        district: facilityDistrict,
        openNow: element.tags?.opening_hours ? !element.tags.opening_hours.includes('closed') : Math.random() > 0.3,
        imageUrl: `https://source.unsplash.com/${imageId}`
      };
    });

    console.log(`🏥 Found ${allFacilities.length} facilities from OpenStreetMap`);

    let facilities = allFacilities;
    
    if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
      console.log(`🔍 Filtering OpenStreetMap results for district: ${districtName}`);
      
      let districtFacilities = allFacilities.filter(facility => {
        const districtMatch = 
          facility.district?.toLowerCase() === districtName.toLowerCase() ||
          (facility.address && facility.address.toLowerCase().includes(districtName.toLowerCase()));
        return districtMatch;
      });
      
      if (districtFacilities.length === 0) {
        districtFacilities = allFacilities.filter(facility => {
          const flexMatch = 
            (facility.district && facility.district.toLowerCase().includes(districtName.toLowerCase())) ||
            (districtName.toLowerCase().includes(facility.district?.toLowerCase() || '')) ||
            (facility.address && facility.address.toLowerCase().includes(districtName.toLowerCase()));
          return flexMatch;
        });
      }
      
      console.log(`✅ After district filtering: ${districtFacilities.length} facilities match`);
      
      if (districtFacilities.length === 0 && allFacilities.length > 0) {
        console.log('⚠️ No facilities match the district exactly, sorting by distance');
        return allFacilities
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          .slice(0, 10);
      }
      
      return districtFacilities;
    } 
    else if (selectedState && selectedState !== 'all' && stateName) {
      console.log(`🔍 Filtering OpenStreetMap results for state: ${stateName}`);
      const stateFacilities = allFacilities.filter(facility => {
        return facility.address?.toLowerCase().includes(stateName.toLowerCase());
      });
      
      console.log(`✅ After state filtering: ${stateFacilities.length} facilities match`);
      return stateFacilities.length > 0 ? stateFacilities : allFacilities;
    }

    return facilities;
  } catch (error) {
    console.error('Error searching nearby facilities:', error);
    return [];
  }
};
