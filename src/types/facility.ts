
export interface Location {
  latitude: number;
  longitude: number;
  displayName?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  address: string;
  contact?: string;
  website?: string;
  openNow: boolean;
  imageUrl?: string;
  district?: string;
}

export interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    'addr:district'?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    healthcare?: string;
    [key: string]: string | undefined;
  };
  type: string;
}
