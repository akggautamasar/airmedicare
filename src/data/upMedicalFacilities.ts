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
  // Hospitals
  {
    id: "h1",
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
    id: "h2",
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
    id: "h3",
    name: "District Hospital Mau",
    type: "hospital",
    category: "government",
    district: "mau",
    address: "Civil Lines, Mau, Uttar Pradesh 275101",
    contact: "+91 547 222 0121",
    rating: 4.2,
    openNow: true,
    emergency: true,
    services: ["Emergency Care", "General Medicine", "Surgery", "Pediatrics"],
    image: "photo-1496307653780-42ee777d4833"
  },
  {
    id: "h4",
    name: "Swaroop Rani Nehru Hospital",
    type: "hospital",
    category: "government",
    district: "prayagraj",
    address: "George Town, Prayagraj, UP 211002",
    contact: "+91 532 256 1251",
    rating: 4.4,
    openNow: true,
    emergency: true,
    services: ["Emergency Services", "Surgery", "Orthopedics", "Gynecology"],
    image: "photo-1431576901776-e539bd916ba2"
  },
  {
    id: "h5",
    name: "Regency Hospital",
    type: "hospital",
    category: "private",
    district: "kanpur",
    address: "A-2, Sarvodaya Nagar, Kanpur, UP 208005",
    contact: "+91 512 230 1201",
    rating: 4.6,
    openNow: true,
    emergency: true,
    services: ["Super Specialty Care", "ICU", "Cardiology", "Neurology"],
    image: "photo-1449157291145-7efd050a4d0e"
  },
  {
    id: "h6",
    name: "AIIMS Gorakhpur",
    type: "hospital",
    category: "government",
    district: "gorakhpur",
    address: "Kunraghat, Gorakhpur, UP 273008",
    contact: "+91 551 250 5050",
    rating: 4.8,
    openNow: true,
    emergency: true,
    services: ["Multi Specialty", "Research", "Emergency", "Teaching"],
    image: "photo-1459767129954-1b1c1f9b9ace"
  },
  {
    id: "h7",
    name: "Azamgarh City Hospital",
    type: "hospital",
    category: "private",
    district: "azamgarh",
    address: "Civil Lines, Azamgarh, UP 276001",
    contact: "+91 546 228 1234",
    rating: 4.3,
    openNow: true,
    emergency: true,
    services: ["General Medicine", "Surgery", "Pediatrics"],
    image: "photo-1460574283810-2aab119d8511"
  },
  {
    id: "h8",
    name: "Heritage Hospitals",
    type: "hospital",
    category: "private",
    district: "varanasi",
    address: "N-2/236, DLW Road, Varanasi",
    contact: "+91 542 250 1234",
    rating: 4.5,
    openNow: true,
    emergency: true,
    services: ["Multi Specialty", "ICU", "Diagnostics"],
    image: "photo-1486718448742-163732cd1544"
  },
  {
    id: "h9",
    name: "Sahara Hospital",
    type: "hospital",
    category: "private",
    district: "lucknow",
    address: "Viraj Khand, Gomti Nagar, Lucknow",
    contact: "+91 522 674 0000",
    rating: 4.7,
    openNow: true,
    emergency: true,
    services: ["Super Specialty", "Emergency", "Diagnostics"],
    image: "photo-1439337153520-7082a56a81f4"
  },
  {
    id: "h10",
    name: "Galaxy Hospital",
    type: "hospital",
    category: "private",
    district: "prayagraj",
    address: "Civil Lines, Prayagraj",
    contact: "+91 532 245 6789",
    rating: 4.4,
    openNow: true,
    emergency: true,
    services: ["General Medicine", "Surgery", "Pediatrics"],
    image: "photo-1497604401993-f2e922e5cb0a"
  },

  // Pathology Labs
  {
    id: "p1",
    name: "Dr Lal PathLabs",
    type: "pathology-lab",
    district: "lucknow",
    address: "Hazratganj, Lucknow",
    contact: "+91 522 400 0000",
    rating: 4.6,
    openNow: true,
    services: ["Blood Tests", "Imaging", "Health Packages"],
    image: "photo-1473177104440-ffee2f376098"
  },
  {
    id: "p2",
    name: "SRL Diagnostics",
    type: "pathology-lab",
    district: "varanasi",
    address: "Lanka, Varanasi",
    contact: "+91 542 236 7890",
    rating: 4.5,
    openNow: true,
    services: ["Pathology", "Radiology", "Health Checkups"],
    image: "photo-1494891848038-7bd202a2afeb"
  },
  {
    id: "p3",
    name: "Thyrocare",
    type: "pathology-lab",
    district: "kanpur",
    address: "Swaroop Nagar, Kanpur",
    contact: "+91 512 230 4567",
    rating: 4.4,
    openNow: true,
    services: ["Thyroid Tests", "Full Body Checkup", "Home Collection"],
    image: "photo-1551038247-3d9af20df552"
  },
  {
    id: "p4",
    name: "City Diagnostics",
    type: "pathology-lab",
    district: "gorakhpur",
    address: "Medical College Road, Gorakhpur",
    contact: "+91 551 250 3456",
    rating: 4.3,
    openNow: true,
    services: ["Laboratory Tests", "X-Ray", "ECG"],
    image: "photo-1433832597046-4f10e10ac764"
  },
  {
    id: "p5",
    name: "Health Diagnostics",
    type: "pathology-lab",
    district: "prayagraj",
    address: "Civil Lines, Prayagraj",
    contact: "+91 532 256 7890",
    rating: 4.5,
    openNow: true,
    services: ["Blood Tests", "Imaging", "Health Packages"],
    image: "photo-1493397212122-2b85dda8106b"
  },
  {
    id: "p6",
    name: "Modern Lab",
    type: "pathology-lab",
    district: "mau",
    address: "Station Road, Mau",
    contact: "+91 547 222 3456",
    rating: 4.2,
    openNow: true,
    services: ["Pathology", "Basic Tests", "Home Collection"],
    image: "photo-1466442929976-97f336a657be"
  },
  {
    id: "p7",
    name: "Apex Diagnostics",
    type: "pathology-lab",
    district: "azamgarh",
    address: "Civil Lines, Azamgarh",
    contact: "+91 546 228 4567",
    rating: 4.3,
    openNow: true,
    services: ["Laboratory Tests", "X-Ray", "Ultrasound"],
    image: "photo-1492321936769-b49830bc1d1e"
  },
  {
    id: "p8",
    name: "Prime Diagnostics",
    type: "pathology-lab",
    district: "lucknow",
    address: "Gomti Nagar, Lucknow",
    contact: "+91 522 230 1234",
    rating: 4.6,
    openNow: true,
    services: ["Full Body Checkup", "Radiology", "Pathology"],
    image: "photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: "p9",
    name: "Care Diagnostics",
    type: "pathology-lab",
    district: "varanasi",
    address: "Sigra, Varanasi",
    contact: "+91 542 235 6789",
    rating: 4.4,
    openNow: true,
    services: ["Blood Tests", "CT Scan", "MRI"],
    image: "photo-1524230572899-a752b3835840"
  },
  {
    id: "p10",
    name: "Life Care Labs",
    type: "pathology-lab",
    district: "kanpur",
    address: "Kidwai Nagar, Kanpur",
    contact: "+91 512 234 5678",
    rating: 4.5,
    openNow: true,
    services: ["Pathology", "Radiology", "Health Packages"],
    image: "photo-1487958449943-2429e8be8625"
  },

  // Medical Stores
  {
    id: "m1",
    name: "Apollo Pharmacy",
    type: "medical-store",
    district: "lucknow",
    address: "Hazratganj, Lucknow",
    contact: "+91 522 409 1234",
    rating: 4.6,
    openNow: true,
    services: ["24/7 Service", "Home Delivery", "Online Consultation"],
    image: "photo-1487958449943-2429e8be8625"
  },
  {
    id: "m2",
    name: "MedPlus",
    type: "medical-store",
    district: "varanasi",
    address: "Lanka, Varanasi",
    contact: "+91 542 236 4567",
    rating: 4.5,
    openNow: true,
    services: ["Medicines", "Healthcare Products", "Home Delivery"],
    image: "photo-1524230572899-a752b3835840"
  },
  {
    id: "m3",
    name: "City Medicals",
    type: "medical-store",
    district: "kanpur",
    address: "Mall Road, Kanpur",
    contact: "+91 512 230 7890",
    rating: 4.4,
    openNow: true,
    services: ["Pharmacy", "Healthcare Items", "Surgical Supplies"],
    image: "photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: "m4",
    name: "New Medical Store",
    type: "medical-store",
    district: "prayagraj",
    address: "Civil Lines, Prayagraj",
    contact: "+91 532 256 4567",
    rating: 4.3,
    openNow: true,
    services: ["Medicines", "Healthcare Products", "Baby Care"],
    image: "photo-1496307653780-42ee777d4833"
  },
  {
    id: "m5",
    name: "Life Care Pharmacy",
    type: "medical-store",
    district: "gorakhpur",
    address: "Medical College Road, Gorakhpur",
    contact: "+91 551 250 7890",
    rating: 4.5,
    openNow: true,
    services: ["24/7 Pharmacy", "Home Delivery", "Healthcare Products"],
    image: "photo-1431576901776-e539bd916ba2"
  },
  {
    id: "m6",
    name: "Wellness Forever",
    type: "medical-store",
    district: "mau",
    address: "Station Road, Mau",
    contact: "+91 547 222 4567",
    rating: 4.2,
    openNow: true,
    services: ["Medicines", "Healthcare", "Personal Care"],
    image: "photo-1449157291145-7efd050a4d0e"
  },
  {
    id: "m7",
    name: "Care Pharmacy",
    type: "medical-store",
    district: "azamgarh",
    address: "Civil Lines, Azamgarh",
    contact: "+91 546 228 7890",
    rating: 4.3,
    openNow: true,
    services: ["Medicines", "Healthcare Products", "Home Delivery"],
    image: "photo-1459767129954-1b1c1f9b9ace"
  },
  {
    id: "m8",
    name: "98.4 Pharmacy",
    type: "medical-store",
    district: "lucknow",
    address: "Gomti Nagar, Lucknow",
    contact: "+91 522 234 5678",
    rating: 4.6,
    openNow: true,
    services: ["24/7 Service", "Home Delivery", "Healthcare Products"],
    image: "photo-1460574283810-2aab119d8511"
  },
  {
    id: "m9",
    name: "Noble Pharmacy",
    type: "medical-store",
    district: "varanasi",
    address: "Sigra, Varanasi",
    contact: "+91 542 237 8901",
    rating: 4.4,
    openNow: true,
    services: ["Medicines", "Healthcare", "Baby Products"],
    image: "photo-1486718448742-163732cd1544"
  },
  {
    id: "m10",
    name: "Health Zone",
    type: "medical-store",
    district: "kanpur",
    address: "Kidwai Nagar, Kanpur",
    contact: "+91 512 236 7890",
    rating: 4.5,
    openNow: true,
    services: ["Pharmacy", "Healthcare Products", "Home Delivery"],
    image: "photo-1439337153520-7082a56a81f4"
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