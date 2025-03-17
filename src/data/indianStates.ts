
export interface District {
  name: string;
  code: string;
}

export interface State {
  name: string;
  code: string;
  districts: District[];
}

// This is a partial list focusing on UP and some major states
export const indianStates: State[] = [
  {
    name: "Uttar Pradesh",
    code: "UP",
    districts: [
      { name: "Agra", code: "agra" },
      { name: "Aligarh", code: "aligarh" },
      { name: "Allahabad", code: "allahabad" },
      { name: "Ambedkar Nagar", code: "ambedkar-nagar" },
      { name: "Amethi", code: "amethi" },
      { name: "Amroha", code: "amroha" },
      { name: "Auraiya", code: "auraiya" },
      { name: "Azamgarh", code: "azamgarh" },
      { name: "Baghpat", code: "baghpat" },
      { name: "Bahraich", code: "bahraich" },
      { name: "Ballia", code: "ballia" },
      { name: "Balrampur", code: "balrampur" },
      { name: "Banda", code: "banda" },
      { name: "Barabanki", code: "barabanki" },
      { name: "Bareilly", code: "bareilly" },
      { name: "Basti", code: "basti" },
      { name: "Bhadohi", code: "bhadohi" },
      { name: "Bijnor", code: "bijnor" },
      { name: "Budaun", code: "budaun" },
      { name: "Bulandshahr", code: "bulandshahr" },
      { name: "Chandauli", code: "chandauli" },
      { name: "Chitrakoot", code: "chitrakoot" },
      { name: "Deoria", code: "deoria" },
      { name: "Etah", code: "etah" },
      { name: "Etawah", code: "etawah" },
      { name: "Farrukhabad", code: "farrukhabad" },
      { name: "Fatehpur", code: "fatehpur" },
      { name: "Firozabad", code: "firozabad" },
      { name: "Gautam Buddha Nagar", code: "gautam-buddha-nagar" },
      { name: "Ghaziabad", code: "ghaziabad" },
      { name: "Ghazipur", code: "ghazipur" },
      { name: "Gonda", code: "gonda" },
      { name: "Gorakhpur", code: "gorakhpur" },
      { name: "Hamirpur", code: "hamirpur" },
      { name: "Hapur", code: "hapur" },
      { name: "Hardoi", code: "hardoi" },
      { name: "Hathras", code: "hathras" },
      { name: "Jalaun", code: "jalaun" },
      { name: "Jaunpur", code: "jaunpur" },
      { name: "Jhansi", code: "jhansi" },
      { name: "Kannauj", code: "kannauj" },
      { name: "Kanpur Dehat", code: "kanpur-dehat" },
      { name: "Kanpur Nagar", code: "kanpur-nagar" },
      { name: "Kasganj", code: "kasganj" },
      { name: "Kaushambi", code: "kaushambi" },
      { name: "Kheri", code: "kheri" },
      { name: "Kushinagar", code: "kushinagar" },
      { name: "Lalitpur", code: "lalitpur" },
      { name: "Lucknow", code: "lucknow" },
      { name: "Maharajganj", code: "maharajganj" },
      { name: "Mahoba", code: "mahoba" },
      { name: "Mainpuri", code: "mainpuri" },
      { name: "Mathura", code: "mathura" },
      { name: "Mau", code: "mau" },
      { name: "Meerut", code: "meerut" },
      { name: "Mirzapur", code: "mirzapur" },
      { name: "Moradabad", code: "moradabad" },
      { name: "Muzaffarnagar", code: "muzaffarnagar" },
      { name: "Pilibhit", code: "pilibhit" },
      { name: "Pratapgarh", code: "pratapgarh" },
      { name: "Prayagraj", code: "prayagraj" },
      { name: "Raebareli", code: "raebareli" },
      { name: "Rampur", code: "rampur" },
      { name: "Saharanpur", code: "saharanpur" },
      { name: "Sambhal", code: "sambhal" },
      { name: "Sant Kabir Nagar", code: "sant-kabir-nagar" },
      { name: "Shahjahanpur", code: "shahjahanpur" },
      { name: "Shamli", code: "shamli" },
      { name: "Shravasti", code: "shravasti" },
      { name: "Siddharthnagar", code: "siddharthnagar" },
      { name: "Sitapur", code: "sitapur" },
      { name: "Sonbhadra", code: "sonbhadra" },
      { name: "Sultanpur", code: "sultanpur" },
      { name: "Unnao", code: "unnao" },
      { name: "Varanasi", code: "varanasi" }
    ]
  },
  {
    name: "Delhi",
    code: "DL",
    districts: [
      { name: "Central Delhi", code: "central-delhi" },
      { name: "East Delhi", code: "east-delhi" },
      { name: "New Delhi", code: "new-delhi" },
      { name: "North Delhi", code: "north-delhi" },
      { name: "North East Delhi", code: "north-east-delhi" },
      { name: "North West Delhi", code: "north-west-delhi" },
      { name: "South Delhi", code: "south-delhi" },
      { name: "South East Delhi", code: "south-east-delhi" },
      { name: "South West Delhi", code: "south-west-delhi" },
      { name: "West Delhi", code: "west-delhi" }
    ]
  },
  {
    name: "Maharashtra",
    code: "MH",
    districts: [
      { name: "Mumbai", code: "mumbai" },
      { name: "Pune", code: "pune" },
      { name: "Nagpur", code: "nagpur" },
      { name: "Thane", code: "thane" },
      { name: "Nashik", code: "nashik" }
    ]
  }
];
