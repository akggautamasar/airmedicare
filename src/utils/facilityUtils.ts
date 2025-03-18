
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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
  const distance = R * c;
  return distance;
};

export const getRandomImageId = (facilityType: string): string => {
  const hospitalImages = ['y5hQCIn1C6o', 's4qDC1iSaTY', 'L4iI59WB4Yw', 'cGNCepznaV8'];
  const pharmacyImages = ['DPEPYPBZpfs', 'Vcm2lHXVz-o', '7jd3jKVEv3M', '2IBhAtuPH8'];
  const labImages = ['nOVQ8Gj1i8E', 'L8tWZT4CcVQ', '66JMmdEIn9E', 'HJckKnwCXxQ'];
  
  if (facilityType === 'pharmacy' || facilityType === 'medical-store') {
    return pharmacyImages[Math.floor(Math.random() * pharmacyImages.length)];
  } else if (facilityType === 'laboratory' || facilityType === 'doctors' || facilityType === 'pathology') {
    return labImages[Math.floor(Math.random() * labImages.length)];
  } else {
    return hospitalImages[Math.floor(Math.random() * hospitalImages.length)];
  }
};
