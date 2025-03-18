
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';
import { calculateDistance } from '@/utils/facilityUtils';
import { useToast } from '@/components/ui/use-toast';

export const searchFacilitiesInDatabase = async (
  latitude: number, 
  longitude: number, 
  type: string,
  selectedState?: string,
  selectedDistrict?: string,
  districtName?: string,
  stateName?: string
): Promise<Facility[]> => {
  try {
    let facilityType = type;
    if (type === 'medical-store') facilityType = 'pharmacy';
    if (type === 'pathology') facilityType = 'laboratory';
    
    let query = supabase
      .from('healthcare_facilities')
      .select('*');
    
    if (facilityType !== 'all') {
      query = query.eq('type', facilityType);
    }
    
    if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
      console.log(`🔍 Database search: Filtering strictly for district: ${districtName}`);
      query = query.ilike('district', `%${districtName}%`);
    } 
    else if (selectedState && stateName) {
      console.log(`🔍 Database search: Filtering for state: ${stateName}`);
      query = query.ilike('state', `%${stateName}%`);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(30);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('⚠️ No results found in database with current filters');
      return [];
    }
    
    console.log(`✅ Found ${data.length} facilities in database`);
    
    const formattedResults = data.map(facility => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        Number(facility.latitude), 
        Number(facility.longitude)
      );
      
      return {
        id: facility.id,
        name: facility.name,
        type: facility.type,
        distance: `${distance.toFixed(1)} km`,
        rating: facility.rating || 4.0,
        address: facility.address || 'Address not available',
        contact: facility.contact,
        website: facility.website,
        district: facility.district,
        openNow: Math.random() > 0.3,
        imageUrl: facility.image_urls && facility.image_urls.length > 0 
          ? facility.image_urls[0] 
          : undefined
      };
    });
    
    if (selectedDistrict && selectedDistrict !== 'all' && districtName) {
      const verifiedResults = formattedResults.filter(facility => {
        const includesDistrict = 
          facility.district?.toLowerCase().includes(districtName.toLowerCase()) || 
          (facility.address && facility.address.toLowerCase().includes(districtName.toLowerCase()));
        return includesDistrict;
      });
      
      console.log(`🔍 After verification: ${verifiedResults.length} facilities match district "${districtName}"`);
      return verifiedResults;
    }
    
    return formattedResults;
  } catch (error) {
    console.error('Error searching database:', error);
    return [];
  }
};

export const saveFacilitiesToDatabase = async (
  facilities: Facility[], 
  latitude: number, 
  longitude: number, 
  district?: string,
  state?: string
) => {
  if (!facilities.length) return;
  
  try {
    const facilitiesData = facilities.map(facility => {
      let services = [facility.type];
      if (facility.name.toLowerCase().includes('emergency')) services.push('Emergency Care');
      if (facility.type === 'hospital') services.push('General Checkup');
      
      return {
        osm_id: facility.id,
        name: facility.name,
        type: facility.type,
        address: facility.address,
        latitude: latitude,
        longitude: longitude,
        contact: facility.contact || null,
        website: facility.website || null,
        services: services,
        rating: facility.rating,
        image_urls: facility.imageUrl ? [facility.imageUrl] : [],
        district: facility.district || district || 'Unknown',
        state: state || 'Unknown',
      };
    });
    
    const { error } = await supabase
      .from('healthcare_facilities')
      .upsert(facilitiesData, { 
        onConflict: 'osm_id',
        ignoreDuplicates: false 
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving facilities to database:', error);
    throw error;
  }
};
