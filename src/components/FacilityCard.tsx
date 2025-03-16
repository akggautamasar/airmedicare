
import { ExternalLink, Phone } from 'lucide-react';
import { Facility } from '@/hooks/useFacilityData';

interface FacilityCardProps {
  facility: Facility;
}

export const FacilityCard = ({ facility }: FacilityCardProps) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        {facility.imageUrl && (
          <div className="w-full md:w-32 h-24 md:h-32 rounded overflow-hidden flex-shrink-0">
            <img
              src={facility.imageUrl}
              alt={facility.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{facility.name}</h3>
              <p className="text-gray-600 text-sm capitalize">{facility.type.replace('-', ' ')}</p>
              <p className="text-gray-500 text-sm mt-1">{facility.address}</p>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {facility.contact && (
                  <a 
                    href={`tel:${facility.contact}`} 
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {facility.contact}
                  </a>
                )}
                
                {facility.website && (
                  <a 
                    href={facility.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Website
                  </a>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-sm text-gray-500">{facility.distance}</span>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm">{facility.rating}</span>
              </div>
              <span className={`text-xs ${facility.openNow ? 'text-green-500' : 'text-red-500'}`}>
                {facility.openNow ? 'Open Now' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
