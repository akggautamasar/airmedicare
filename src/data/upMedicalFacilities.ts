export interface Doctor {
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  availability: string[];
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'medical-store' | 'pathology-lab';
  category?: 'government' | 'private' | 'charitable';
  specialties?: string[];
  district: string;
  address: string;
  contact: string;
  rating: number;
  openNow: boolean;
  emergency?: boolean;
  doctors?: Doctor[];
  services: string[];
  image: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const upMedicalFacilities: MedicalFacility[] = [
  {
    id: "1",
    name: "BHU Sir Sunderlal Hospital",
    type: "hospital",
    category: "government",
    district: "varanasi",
    address: "Lanka, Varanasi, Uttar Pradesh 221005",
    contact: "+91 542 236 7568",
    rating: 4.5,
    openNow: true,
    emergency: true,
    specialties: ["General Medicine", "Cardiology", "Neurology", "Orthopedics"],
    doctors: [
      {
        name: "Dr. Rajesh Kumar",
        specialization: "Cardiology",
        qualification: "MD, DM Cardiology",
        experience: "15+ years",
        availability: ["Mon-Fri", "9:00 AM - 2:00 PM"]
      },
      {
        name: "Dr. Meena Singh",
        specialization: "Neurology",
        qualification: "MD, DM Neurology",
        experience: "12+ years",
        availability: ["Mon-Sat", "10:00 AM - 4:00 PM"]
      }
    ],
    services: ["24/7 Emergency", "ICU", "Operation Theatre", "Pharmacy"],
    image: "photo-1527576539890-dfa815648363"
  },
  {
    id: "2",
    name: "KGMU Lucknow",
    type: "hospital",
    category: "government",
    district: "lucknow",
    address: "Shah Mina Road, Chowk, Lucknow, UP 226003",
    contact: "+91 522 225 7540",
    rating: 4.7,
    openNow: true,
    emergency: true,
    specialties: ["Multi-Specialty", "Trauma Center", "Cancer Treatment"],
    doctors: [
      {
        name: "Dr. Amit Agarwal",
        specialization: "Oncology",
        qualification: "MD, DM Oncology",
        experience: "20+ years",
        availability: ["Mon-Sat", "9:00 AM - 3:00 PM"]
      }
    ],
    services: ["Emergency Care", "Cancer Treatment", "Surgery", "Diagnostics"],
    image: "photo-1488972685288-c3fd157d7c7a"
  },
  {
    id: "3",
    name: "Apollo Pharmacy",
    type: "medical-store",
    district: "lucknow",
    address: "Hazratganj, Lucknow, UP 226001",
    contact: "+91 522 409 1234",
    rating: 4.6,
    openNow: true,
    services: ["24/7 Service", "Home Delivery", "Online Consultation"],
    image: "photo-1487958449943-2429e8be8625"
  },
  {
    id: "4",
    name: "Charak Diagnostics",
    type: "pathology-lab",
    district: "prayagraj",
    address: "Civil Lines, Prayagraj, UP 211001",
    contact: "+91 532 234 5678",
    rating: 4.4,
    openNow: true,
    services: ["Blood Tests", "X-Ray", "MRI", "CT Scan"],
    image: "photo-1518005020951-eccb494ad742"
  },
  {
    id: "5",
    name: "City Hospital Gorakhpur",
    type: "hospital",
    category: "private",
    district: "gorakhpur",
    address: "Medical College Road, Gorakhpur, UP 273013",
    contact: "+91 551 250 1234",
    rating: 4.3,
    openNow: true,
    emergency: true,
    doctors: [
      {
        name: "Dr. Priya Sharma",
        specialization: "General Medicine",
        qualification: "MBBS, MD",
        experience: "8+ years",
        availability: ["Mon-Sat", "10:00 AM - 6:00 PM"]
      }
    ],
    services: ["ICU", "General Medicine", "Pediatrics"],
    image: "photo-1496307653780-42ee777d4833"
  }
];

export const upDistricts = [
  "mau",
  "varanasi",
  "lucknow",
  "prayagraj",
  "kanpur",
  "azamgarh",
  "gorakhpur"
];

export const facilityCategories = [
  "government",
  "private",
  "charitable"
] as const;