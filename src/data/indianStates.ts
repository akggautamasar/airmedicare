
export interface District {
  name: string;
  code: string;
}

export interface State {
  name: string;
  code: string;
  districts: District[];
}

// Complete list of Indian states and their districts
export const indianStates: State[] = [
  {
    name: "Andhra Pradesh",
    code: "AP",
    districts: [
      { name: "Anantapur", code: "anantapur" },
      { name: "Chittoor", code: "chittoor" },
      { name: "East Godavari", code: "east-godavari" },
      { name: "Guntur", code: "guntur" },
      { name: "Krishna", code: "krishna" },
      { name: "Kurnool", code: "kurnool" },
      { name: "Prakasam", code: "prakasam" },
      { name: "Srikakulam", code: "srikakulam" },
      { name: "Sri Potti Sriramulu Nellore", code: "nellore" },
      { name: "Visakhapatnam", code: "visakhapatnam" },
      { name: "Vizianagaram", code: "vizianagaram" },
      { name: "West Godavari", code: "west-godavari" },
      { name: "YSR District, Kadapa", code: "kadapa" }
    ]
  },
  {
    name: "Arunachal Pradesh",
    code: "AR",
    districts: [
      { name: "Anjaw", code: "anjaw" },
      { name: "Changlang", code: "changlang" },
      { name: "Dibang Valley", code: "dibang-valley" },
      { name: "East Kameng", code: "east-kameng" },
      { name: "East Siang", code: "east-siang" },
      { name: "Kamle", code: "kamle" },
      { name: "Kra Daadi", code: "kra-daadi" },
      { name: "Kurung Kumey", code: "kurung-kumey" },
      { name: "Lepa Rada", code: "lepa-rada" },
      { name: "Lohit", code: "lohit" },
      { name: "Longding", code: "longding" },
      { name: "Lower Dibang Valley", code: "lower-dibang-valley" },
      { name: "Lower Siang", code: "lower-siang" },
      { name: "Lower Subansiri", code: "lower-subansiri" },
      { name: "Namsai", code: "namsai" },
      { name: "Pakke Kessang", code: "pakke-kessang" },
      { name: "Papum Pare", code: "papum-pare" },
      { name: "Shi Yomi", code: "shi-yomi" },
      { name: "Siang", code: "siang" },
      { name: "Tawang", code: "tawang" },
      { name: "Tirap", code: "tirap" },
      { name: "Upper Siang", code: "upper-siang" },
      { name: "Upper Subansiri", code: "upper-subansiri" },
      { name: "West Kameng", code: "west-kameng" },
      { name: "West Siang", code: "west-siang" }
    ]
  },
  {
    name: "Assam",
    code: "AS",
    districts: [
      { name: "Baksa", code: "baksa" },
      { name: "Barpeta", code: "barpeta" },
      { name: "Biswanath", code: "biswanath" },
      { name: "Bongaigaon", code: "bongaigaon" },
      { name: "Cachar", code: "cachar" },
      { name: "Charaideo", code: "charaideo" },
      { name: "Chirang", code: "chirang" },
      { name: "Darrang", code: "darrang" },
      { name: "Dhemaji", code: "dhemaji" },
      { name: "Dhubri", code: "dhubri" },
      { name: "Dibrugarh", code: "dibrugarh" },
      { name: "Dima Hasao", code: "dima-hasao" },
      { name: "Goalpara", code: "goalpara" },
      { name: "Golaghat", code: "golaghat" },
      { name: "Hailakandi", code: "hailakandi" },
      { name: "Hojai", code: "hojai" },
      { name: "Jorhat", code: "jorhat" },
      { name: "Kamrup", code: "kamrup" },
      { name: "Kamrup Metropolitan", code: "kamrup-metropolitan" },
      { name: "Karbi Anglong", code: "karbi-anglong" },
      { name: "Karimganj", code: "karimganj" },
      { name: "Kokrajhar", code: "kokrajhar" },
      { name: "Lakhimpur", code: "lakhimpur" },
      { name: "Majuli", code: "majuli" },
      { name: "Morigaon", code: "morigaon" },
      { name: "Nagaon", code: "nagaon" },
      { name: "Nalbari", code: "nalbari" },
      { name: "Sivasagar", code: "sivasagar" },
      { name: "Sonitpur", code: "sonitpur" },
      { name: "South Salmara-Mankachar", code: "south-salmara-mankachar" },
      { name: "Tinsukia", code: "tinsukia" },
      { name: "Udalguri", code: "udalguri" },
      { name: "West Karbi Anglong", code: "west-karbi-anglong" }
    ]
  },
  {
    name: "Bihar",
    code: "BR",
    districts: [
      { name: "Araria", code: "araria" },
      { name: "Arwal", code: "arwal" },
      { name: "Aurangabad", code: "aurangabad-bihar" },
      { name: "Banka", code: "banka" },
      { name: "Begusarai", code: "begusarai" },
      { name: "Bhagalpur", code: "bhagalpur" },
      { name: "Bhojpur", code: "bhojpur" },
      { name: "Buxar", code: "buxar" },
      { name: "Darbhanga", code: "darbhanga" },
      { name: "East Champaran", code: "east-champaran" },
      { name: "Gaya", code: "gaya" },
      { name: "Gopalganj", code: "gopalganj" },
      { name: "Jamui", code: "jamui" },
      { name: "Jehanabad", code: "jehanabad" },
      { name: "Kaimur", code: "kaimur" },
      { name: "Katihar", code: "katihar" },
      { name: "Khagaria", code: "khagaria" },
      { name: "Kishanganj", code: "kishanganj" },
      { name: "Lakhisarai", code: "lakhisarai" },
      { name: "Madhepura", code: "madhepura" },
      { name: "Madhubani", code: "madhubani" },
      { name: "Munger", code: "munger" },
      { name: "Muzaffarpur", code: "muzaffarpur" },
      { name: "Nalanda", code: "nalanda" },
      { name: "Nawada", code: "nawada" },
      { name: "Patna", code: "patna" },
      { name: "Purnia", code: "purnia" },
      { name: "Rohtas", code: "rohtas" },
      { name: "Saharsa", code: "saharsa" },
      { name: "Samastipur", code: "samastipur" },
      { name: "Saran", code: "saran" },
      { name: "Sheikhpura", code: "sheikhpura" },
      { name: "Sheohar", code: "sheohar" },
      { name: "Sitamarhi", code: "sitamarhi" },
      { name: "Siwan", code: "siwan" },
      { name: "Supaul", code: "supaul" },
      { name: "Vaishali", code: "vaishali" },
      { name: "West Champaran", code: "west-champaran" }
    ]
  },
  {
    name: "Chhattisgarh",
    code: "CG",
    districts: [
      { name: "Balod", code: "balod" },
      { name: "Baloda Bazar", code: "baloda-bazar" },
      { name: "Balrampur", code: "balrampur-cg" },
      { name: "Bastar", code: "bastar" },
      { name: "Bemetara", code: "bemetara" },
      { name: "Bijapur", code: "bijapur-cg" },
      { name: "Bilaspur", code: "bilaspur-cg" },
      { name: "Dantewada", code: "dantewada" },
      { name: "Dhamtari", code: "dhamtari" },
      { name: "Durg", code: "durg" },
      { name: "Gariaband", code: "gariaband" },
      { name: "Janjgir-Champa", code: "janjgir-champa" },
      { name: "Jashpur", code: "jashpur" },
      { name: "Kabirdham", code: "kabirdham" },
      { name: "Kanker", code: "kanker" },
      { name: "Kondagaon", code: "kondagaon" },
      { name: "Korba", code: "korba" },
      { name: "Koriya", code: "koriya" },
      { name: "Mahasamund", code: "mahasamund" },
      { name: "Mungeli", code: "mungeli" },
      { name: "Narayanpur", code: "narayanpur" },
      { name: "Raigarh", code: "raigarh" },
      { name: "Raipur", code: "raipur" },
      { name: "Rajnandgaon", code: "rajnandgaon" },
      { name: "Sukma", code: "sukma" },
      { name: "Surajpur", code: "surajpur" },
      { name: "Surguja", code: "surguja" }
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
      { name: "Shahdara", code: "shahdara" },
      { name: "South Delhi", code: "south-delhi" },
      { name: "South East Delhi", code: "south-east-delhi" },
      { name: "South West Delhi", code: "south-west-delhi" },
      { name: "West Delhi", code: "west-delhi" }
    ]
  },
  {
    name: "Goa",
    code: "GA",
    districts: [
      { name: "North Goa", code: "north-goa" },
      { name: "South Goa", code: "south-goa" }
    ]
  },
  {
    name: "Gujarat",
    code: "GJ",
    districts: [
      { name: "Ahmedabad", code: "ahmedabad" },
      { name: "Amreli", code: "amreli" },
      { name: "Anand", code: "anand" },
      { name: "Aravalli", code: "aravalli" },
      { name: "Banaskantha", code: "banaskantha" },
      { name: "Bharuch", code: "bharuch" },
      { name: "Bhavnagar", code: "bhavnagar" },
      { name: "Botad", code: "botad" },
      { name: "Chhota Udaipur", code: "chhota-udaipur" },
      { name: "Dahod", code: "dahod" },
      { name: "Dang", code: "dang" },
      { name: "Devbhoomi Dwarka", code: "devbhoomi-dwarka" },
      { name: "Gandhinagar", code: "gandhinagar" },
      { name: "Gir Somnath", code: "gir-somnath" },
      { name: "Jamnagar", code: "jamnagar" },
      { name: "Junagadh", code: "junagadh" },
      { name: "Kachchh", code: "kachchh" },
      { name: "Kheda", code: "kheda" },
      { name: "Mahisagar", code: "mahisagar" },
      { name: "Mehsana", code: "mehsana" },
      { name: "Morbi", code: "morbi" },
      { name: "Narmada", code: "narmada" },
      { name: "Navsari", code: "navsari" },
      { name: "Panchmahal", code: "panchmahal" },
      { name: "Patan", code: "patan" },
      { name: "Porbandar", code: "porbandar" },
      { name: "Rajkot", code: "rajkot" },
      { name: "Sabarkantha", code: "sabarkantha" },
      { name: "Surat", code: "surat" },
      { name: "Surendranagar", code: "surendranagar" },
      { name: "Tapi", code: "tapi" },
      { name: "Vadodara", code: "vadodara" },
      { name: "Valsad", code: "valsad" }
    ]
  },
  {
    name: "Haryana",
    code: "HR",
    districts: [
      { name: "Ambala", code: "ambala" },
      { name: "Bhiwani", code: "bhiwani" },
      { name: "Charkhi Dadri", code: "charkhi-dadri" },
      { name: "Faridabad", code: "faridabad" },
      { name: "Fatehabad", code: "fatehabad" },
      { name: "Gurugram", code: "gurugram" },
      { name: "Hisar", code: "hisar" },
      { name: "Jhajjar", code: "jhajjar" },
      { name: "Jind", code: "jind" },
      { name: "Kaithal", code: "kaithal" },
      { name: "Karnal", code: "karnal" },
      { name: "Kurukshetra", code: "kurukshetra" },
      { name: "Mahendragarh", code: "mahendragarh" },
      { name: "Nuh", code: "nuh" },
      { name: "Palwal", code: "palwal" },
      { name: "Panchkula", code: "panchkula" },
      { name: "Panipat", code: "panipat" },
      { name: "Rewari", code: "rewari" },
      { name: "Rohtak", code: "rohtak" },
      { name: "Sirsa", code: "sirsa" },
      { name: "Sonipat", code: "sonipat" },
      { name: "Yamunanagar", code: "yamunanagar" }
    ]
  },
  {
    name: "Himachal Pradesh",
    code: "HP",
    districts: [
      { name: "Bilaspur", code: "bilaspur-hp" },
      { name: "Chamba", code: "chamba" },
      { name: "Hamirpur", code: "hamirpur-hp" },
      { name: "Kangra", code: "kangra" },
      { name: "Kinnaur", code: "kinnaur" },
      { name: "Kullu", code: "kullu" },
      { name: "Lahaul and Spiti", code: "lahaul-spiti" },
      { name: "Mandi", code: "mandi" },
      { name: "Shimla", code: "shimla" },
      { name: "Sirmaur", code: "sirmaur" },
      { name: "Solan", code: "solan" },
      { name: "Una", code: "una" }
    ]
  },
  {
    name: "Jharkhand",
    code: "JH",
    districts: [
      { name: "Bokaro", code: "bokaro" },
      { name: "Chatra", code: "chatra" },
      { name: "Deoghar", code: "deoghar" },
      { name: "Dhanbad", code: "dhanbad" },
      { name: "Dumka", code: "dumka" },
      { name: "East Singhbhum", code: "east-singhbhum" },
      { name: "Garhwa", code: "garhwa" },
      { name: "Giridih", code: "giridih" },
      { name: "Godda", code: "godda" },
      { name: "Gumla", code: "gumla" },
      { name: "Hazaribagh", code: "hazaribagh" },
      { name: "Jamtara", code: "jamtara" },
      { name: "Khunti", code: "khunti" },
      { name: "Koderma", code: "koderma" },
      { name: "Latehar", code: "latehar" },
      { name: "Lohardaga", code: "lohardaga" },
      { name: "Pakur", code: "pakur" },
      { name: "Palamu", code: "palamu" },
      { name: "Ramgarh", code: "ramgarh" },
      { name: "Ranchi", code: "ranchi" },
      { name: "Sahibganj", code: "sahibganj" },
      { name: "Seraikela Kharsawan", code: "seraikela-kharsawan" },
      { name: "Simdega", code: "simdega" },
      { name: "West Singhbhum", code: "west-singhbhum" }
    ]
  },
  {
    name: "Karnataka",
    code: "KA",
    districts: [
      { name: "Bagalkot", code: "bagalkot" },
      { name: "Ballari", code: "ballari" },
      { name: "Belagavi", code: "belagavi" },
      { name: "Bengaluru Rural", code: "bengaluru-rural" },
      { name: "Bengaluru Urban", code: "bengaluru-urban" },
      { name: "Bidar", code: "bidar" },
      { name: "Chamarajanagar", code: "chamarajanagar" },
      { name: "Chikballapur", code: "chikballapur" },
      { name: "Chikkamagaluru", code: "chikkamagaluru" },
      { name: "Chitradurga", code: "chitradurga" },
      { name: "Dakshina Kannada", code: "dakshina-kannada" },
      { name: "Davanagere", code: "davanagere" },
      { name: "Dharwad", code: "dharwad" },
      { name: "Gadag", code: "gadag" },
      { name: "Hassan", code: "hassan" },
      { name: "Haveri", code: "haveri" },
      { name: "Kalaburagi", code: "kalaburagi" },
      { name: "Kodagu", code: "kodagu" },
      { name: "Kolar", code: "kolar" },
      { name: "Koppal", code: "koppal" },
      { name: "Mandya", code: "mandya" },
      { name: "Mysuru", code: "mysuru" },
      { name: "Raichur", code: "raichur" },
      { name: "Ramanagara", code: "ramanagara" },
      { name: "Shivamogga", code: "shivamogga" },
      { name: "Tumakuru", code: "tumakuru" },
      { name: "Udupi", code: "udupi" },
      { name: "Uttara Kannada", code: "uttara-kannada" },
      { name: "Vijayapura", code: "vijayapura" },
      { name: "Yadgir", code: "yadgir" }
    ]
  },
  {
    name: "Kerala",
    code: "KL",
    districts: [
      { name: "Alappuzha", code: "alappuzha" },
      { name: "Ernakulam", code: "ernakulam" },
      { name: "Idukki", code: "idukki" },
      { name: "Kannur", code: "kannur" },
      { name: "Kasaragod", code: "kasaragod" },
      { name: "Kollam", code: "kollam" },
      { name: "Kottayam", code: "kottayam" },
      { name: "Kozhikode", code: "kozhikode" },
      { name: "Malappuram", code: "malappuram" },
      { name: "Palakkad", code: "palakkad" },
      { name: "Pathanamthitta", code: "pathanamthitta" },
      { name: "Thiruvananthapuram", code: "thiruvananthapuram" },
      { name: "Thrissur", code: "thrissur" },
      { name: "Wayanad", code: "wayanad" }
    ]
  },
  {
    name: "Madhya Pradesh",
    code: "MP",
    districts: [
      { name: "Agar Malwa", code: "agar-malwa" },
      { name: "Alirajpur", code: "alirajpur" },
      { name: "Anuppur", code: "anuppur" },
      { name: "Ashoknagar", code: "ashoknagar" },
      { name: "Balaghat", code: "balaghat" },
      { name: "Barwani", code: "barwani" },
      { name: "Betul", code: "betul" },
      { name: "Bhind", code: "bhind" },
      { name: "Bhopal", code: "bhopal" },
      { name: "Burhanpur", code: "burhanpur" },
      { name: "Chhatarpur", code: "chhatarpur" },
      { name: "Chhindwara", code: "chhindwara" },
      { name: "Damoh", code: "damoh" },
      { name: "Datia", code: "datia" },
      { name: "Dewas", code: "dewas" },
      { name: "Dhar", code: "dhar" },
      { name: "Dindori", code: "dindori" },
      { name: "Guna", code: "guna" },
      { name: "Gwalior", code: "gwalior" },
      { name: "Harda", code: "harda" },
      { name: "Hoshangabad", code: "hoshangabad" },
      { name: "Indore", code: "indore" },
      { name: "Jabalpur", code: "jabalpur" },
      { name: "Jhabua", code: "jhabua" },
      { name: "Katni", code: "katni" },
      { name: "Khandwa", code: "khandwa" },
      { name: "Khargone", code: "khargone" },
      { name: "Mandla", code: "mandla" },
      { name: "Mandsaur", code: "mandsaur" },
      { name: "Morena", code: "morena" },
      { name: "Narsinghpur", code: "narsinghpur" },
      { name: "Neemuch", code: "neemuch" },
      { name: "Niwari", code: "niwari" },
      { name: "Panna", code: "panna" },
      { name: "Raisen", code: "raisen" },
      { name: "Rajgarh", code: "rajgarh" },
      { name: "Ratlam", code: "ratlam" },
      { name: "Rewa", code: "rewa" },
      { name: "Sagar", code: "sagar" },
      { name: "Satna", code: "satna" },
      { name: "Sehore", code: "sehore" },
      { name: "Seoni", code: "seoni" },
      { name: "Shahdol", code: "shahdol" },
      { name: "Shajapur", code: "shajapur" },
      { name: "Sheopur", code: "sheopur" },
      { name: "Shivpuri", code: "shivpuri" },
      { name: "Sidhi", code: "sidhi" },
      { name: "Singrauli", code: "singrauli" },
      { name: "Tikamgarh", code: "tikamgarh" },
      { name: "Ujjain", code: "ujjain" },
      { name: "Umaria", code: "umaria" },
      { name: "Vidisha", code: "vidisha" }
    ]
  },
  {
    name: "Maharashtra",
    code: "MH",
    districts: [
      { name: "Ahmednagar", code: "ahmednagar" },
      { name: "Akola", code: "akola" },
      { name: "Amravati", code: "amravati" },
      { name: "Aurangabad", code: "aurangabad-mh" },
      { name: "Beed", code: "beed" },
      { name: "Bhandara", code: "bhandara" },
      { name: "Buldhana", code: "buldhana" },
      { name: "Chandrapur", code: "chandrapur" },
      { name: "Dhule", code: "dhule" },
      { name: "Gadchiroli", code: "gadchiroli" },
      { name: "Gondia", code: "gondia" },
      { name: "Hingoli", code: "hingoli" },
      { name: "Jalgaon", code: "jalgaon" },
      { name: "Jalna", code: "jalna" },
      { name: "Kolhapur", code: "kolhapur" },
      { name: "Latur", code: "latur" },
      { name: "Mumbai City", code: "mumbai-city" },
      { name: "Mumbai Suburban", code: "mumbai-suburban" },
      { name: "Nagpur", code: "nagpur" },
      { name: "Nanded", code: "nanded" },
      { name: "Nandurbar", code: "nandurbar" },
      { name: "Nashik", code: "nashik" },
      { name: "Osmanabad", code: "osmanabad" },
      { name: "Palghar", code: "palghar" },
      { name: "Parbhani", code: "parbhani" },
      { name: "Pune", code: "pune" },
      { name: "Raigad", code: "raigad" },
      { name: "Ratnagiri", code: "ratnagiri" },
      { name: "Sangli", code: "sangli" },
      { name: "Satara", code: "satara" },
      { name: "Sindhudurg", code: "sindhudurg" },
      { name: "Solapur", code: "solapur" },
      { name: "Thane", code: "thane" },
      { name: "Wardha", code: "wardha" },
      { name: "Washim", code: "washim" },
      { name: "Yavatmal", code: "yavatmal" }
    ]
  },
  {
    name: "Manipur",
    code: "MN",
    districts: [
      { name: "Bishnupur", code: "bishnupur" },
      { name: "Chandel", code: "chandel" },
      { name: "Churachandpur", code: "churachandpur" },
      { name: "Imphal East", code: "imphal-east" },
      { name: "Imphal West", code: "imphal-west" },
      { name: "Jiribam", code: "jiribam" },
      { name: "Kakching", code: "kakching" },
      { name: "Kamjong", code: "kamjong" },
      { name: "Kangpokpi", code: "kangpokpi" },
      { name: "Noney", code: "noney" },
      { name: "Pherzawl", code: "pherzawl" },
      { name: "Senapati", code: "senapati" },
      { name: "Tamenglong", code: "tamenglong" },
      { name: "Tengnoupal", code: "tengnoupal" },
      { name: "Thoubal", code: "thoubal" },
      { name: "Ukhrul", code: "ukhrul" }
    ]
  },
  {
    name: "Meghalaya",
    code: "ML",
    districts: [
      { name: "East Garo Hills", code: "east-garo-hills" },
      { name: "East Jaintia Hills", code: "east-jaintia-hills" },
      { name: "East Khasi Hills", code: "east-khasi-hills" },
      { name: "North Garo Hills", code: "north-garo-hills" },
      { name: "Ri Bhoi", code: "ri-bhoi" },
      { name: "South Garo Hills", code: "south-garo-hills" },
      { name: "South West Garo Hills", code: "south-west-garo-hills" },
      { name: "South West Khasi Hills", code: "south-west-khasi-hills" },
      { name: "West Garo Hills", code: "west-garo-hills" },
      { name: "West Jaintia Hills", code: "west-jaintia-hills" },
      { name: "West Khasi Hills", code: "west-khasi-hills" }
    ]
  },
  {
    name: "Mizoram",
    code: "MZ",
    districts: [
      { name: "Aizawl", code: "aizawl" },
      { name: "Champhai", code: "champhai" },
      { name: "Hnahthial", code: "hnahthial" },
      { name: "Khawzawl", code: "khawzawl" },
      { name: "Kolasib", code: "kolasib" },
      { name: "Lawngtlai", code: "lawngtlai" },
      { name: "Lunglei", code: "lunglei" },
      { name: "Mamit", code: "mamit" },
      { name: "Saiha", code: "saiha" },
      { name: "Saitual", code: "saitual" },
      { name: "Serchhip", code: "serchhip" }
    ]
  },
  {
    name: "Nagaland",
    code: "NL",
    districts: [
      { name: "Dimapur", code: "dimapur" },
      { name: "Kiphire", code: "kiphire" },
      { name: "Kohima", code: "kohima" },
      { name: "Longleng", code: "longleng" },
      { name: "Mokokchung", code: "mokokchung" },
      { name: "Mon", code: "mon" },
      { name: "Peren", code: "peren" },
      { name: "Phek", code: "phek" },
      { name: "Tuensang", code: "tuensang" },
      { name: "Wokha", code: "wokha" },
      { name: "Zunheboto", code: "zunheboto" }
    ]
  },
  {
    name: "Odisha",
    code: "OD",
    districts: [
      { name: "Angul", code: "angul" },
      { name: "Balangir", code: "balangir" },
      { name: "Balasore", code: "balasore" },
      { name: "Bargarh", code: "bargarh" },
      { name: "Bhadrak", code: "bhadrak" },
      { name: "Boudh", code: "boudh" },
      { name: "Cuttack", code: "cuttack" },
      { name: "Deogarh", code: "deogarh" },
      { name: "Dhenkanal", code: "dhenkanal" },
      { name: "Gajapati", code: "gajapati" },
      { name: "Ganjam", code: "ganjam" },
      { name: "Jagatsinghpur", code: "jagatsinghpur" },
      { name: "Jajpur", code: "jajpur" },
      { name: "Jharsuguda", code: "jharsuguda" },
      { name: "Kalahandi", code: "kalahandi" },
      { name: "Kandhamal", code: "kandhamal" },
      { name: "Kendrapara", code: "kendrapara" },
      { name: "Kendujhar", code: "kendujhar" },
      { name: "Khordha", code: "khordha" },
      { name: "Koraput", code: "koraput" },
      { name: "Malkangiri", code: "malkangiri" },
      { name: "Mayurbhanj", code: "mayurbhanj" },
      { name: "Nabarangpur", code: "nabarangpur" },
      { name: "Nayagarh", code: "nayagarh" },
      { name: "Nuapada", code: "nuapada" },
      { name: "Puri", code: "puri" },
      { name: "Rayagada", code: "rayagada" },
      { name: "Sambalpur", code: "sambalpur" },
      { name: "Subarnapur", code: "subarnapur" },
      { name: "Sundargarh", code: "sundargarh" }
    ]
  },
  {
    name: "Punjab",
    code: "PB",
    districts: [
      { name: "Amritsar", code: "amritsar" },
      { name: "Barnala", code: "barnala" },
      { name: "Bathinda", code: "bathinda" },
      { name: "Faridkot", code: "faridkot" },
      { name: "Fatehgarh Sahib", code: "fatehgarh-sahib" },
      { name: "Fazilka", code: "fazilka" },
      { name: "Ferozepur", code: "ferozepur" },
      { name: "Gurdaspur", code: "gurdaspur" },
      { name: "Hoshiarpur", code: "hoshiarpur" },
      { name: "Jalandhar", code: "jalandhar" },
      { name: "Kapurthala", code: "kapurthala" },
      { name: "Ludhiana", code: "ludhiana" },
      { name: "Mansa", code: "mansa" },
      { name: "Moga", code: "moga" },
      { name: "Muktsar", code: "muktsar" },
      { name: "Pathankot", code: "pathankot" },
      { name: "Patiala", code: "patiala" },
      { name: "Rupnagar", code: "rupnagar" },
      { name: "Sahibzada Ajit Singh Nagar", code: "sahibzada-ajit-singh-nagar" },
      { name: "Sangrur", code: "sangrur" },
      { name: "Shahid Bhagat Singh Nagar", code: "shahid-bhagat-singh-nagar" },
      { name: "Tarn Taran", code: "tarn-taran" }
    ]
  },
  {
    name: "Rajasthan",
    code: "RJ",
    districts: [
      { name: "Ajmer", code: "ajmer" },
      { name: "Alwar", code: "alwar" },
      { name: "Banswara", code: "banswara" },
      { name: "Baran", code: "baran" },
      { name: "Barmer", code: "barmer" },
      { name: "Bharatpur", code: "bharatpur" },
      { name: "Bhilwara", code: "bhilwara" },
      { name: "Bikaner", code: "bikaner" },
      { name: "Bundi", code: "bundi" },
      { name: "Chittorgarh", code: "chittorgarh" },
      { name: "Churu", code: "churu" },
      { name: "Dausa", code: "dausa" },
      { name: "Dholpur", code: "dholpur" },
      { name: "Dungarpur", code: "dungarpur" },
      { name: "Hanumangarh", code: "hanumangarh" },
      { name: "Jaipur", code: "jaipur" },
      { name: "Jaisalmer", code: "jaisalmer" },
      { name: "Jalore", code: "jalore" },
      { name: "Jhalawar", code: "jhalawar" },
      { name: "Jhunjhunu", code: "jhunjhunu" },
      { name: "Jodhpur", code: "jodhpur" },
      { name: "Karauli", code: "karauli" },
      { name: "Kota", code: "kota" },
      { name: "Nagaur", code: "nagaur" },
      { name: "Pali", code: "pali" },
      { name: "Pratapgarh", code: "pratapgarh-rj" },
      { name: "Rajsamand", code: "rajsamand" },
      { name: "Sawai Madhopur", code: "sawai-madhopur" },
      { name: "Sikar", code: "sikar" },
      { name: "Sirohi", code: "sirohi" },
      { name: "Sri Ganganagar", code: "sri-ganganagar" },
      { name: "Tonk", code: "tonk" },
      { name: "Udaipur", code: "udaipur" }
    ]
  },
  {
    name: "Sikkim",
    code: "SK",
    districts: [
      { name: "East Sikkim", code: "east-sikkim" },
      { name: "North Sikkim", code: "north-sikkim" },
      { name: "South Sikkim", code: "south-sikkim" },
      { name: "West Sikkim", code: "west-sikkim" }
    ]
  },
  {
    name: "Tamil Nadu",
    code: "TN",
    districts: [
      { name: "Ariyalur", code: "ariyalur" },
      { name: "Chengalpattu", code: "chengalpattu" },
      { name: "Chennai", code: "chennai" },
      { name: "Coimbatore", code: "coimbatore" },
      { name: "Cuddalore", code: "cuddalore" },
      { name: "Dharmapuri", code: "dharmapuri" },
      { name: "Dindigul", code: "dindigul" },
      { name: "Erode", code: "erode" },
      { name: "Kallakurichi", code: "kallakurichi" },
      { name: "Kancheepuram", code: "kancheepuram" },
      { name: "Karur", code: "karur" },
      { name: "Krishnagiri", code: "krishnagiri" },
      { name: "Madurai", code: "madurai" },
      { name: "Mayiladuthurai", code: "mayiladuthurai" },
      { name: "Nagapattinam", code: "nagapattinam" },
      { name: "Namakkal", code: "namakkal" },
      { name: "Nilgiris", code: "nilgiris" },
      { name: "Perambalur", code: "perambalur" },
      { name: "Pudukkottai", code: "pudukkottai" },
      { name: "Ramanathapuram", code: "ramanathapuram" },
      { name: "Ranipet", code: "ranipet" },
      { name: "Salem", code: "salem" },
      { name: "Sivaganga", code: "sivaganga" },
      { name: "Tenkasi", code: "tenkasi" },
      { name: "Thanjavur", code: "thanjavur" },
      { name: "Theni", code: "theni" },
      { name: "Thoothukudi", code: "thoothukudi" },
      { name: "Tiruchirappalli", code: "tiruchirappalli" },
      { name: "Tirunelveli", code: "tirunelveli" },
      { name: "Tirupathur", code: "tirupathur" },
      { name: "Tiruppur", code: "tiruppur" },
      { name: "Tiruvallur", code: "tiruvallur" },
      { name: "Tiruvannamalai", code: "tiruvannamalai" },
      { name: "Tiruvarur", code: "tiruvarur" },
      { name: "Vellore", code: "vellore" },
      { name: "Viluppuram", code: "viluppuram" },
      { name: "Virudhunagar", code: "virudhunagar" }
    ]
  },
  {
    name: "Telangana",
    code: "TG",
    districts: [
      { name: "Adilabad", code: "adilabad" },
      { name: "Bhadradri Kothagudem", code: "bhadradri-kothagudem" },
      { name: "Hyderabad", code: "hyderabad" },
      { name: "Jagtial", code: "jagtial" },
      { name: "Jangaon", code: "jangaon" },
      { name: "Jayashankar Bhupalpally", code: "jayashankar-bhupalpally" },
      { name: "Jogulamba Gadwal", code: "jogulamba-gadwal" },
      { name: "Kamareddy", code: "kamareddy" },
      { name: "Karimnagar", code: "karimnagar" },
      { name: "Khammam", code: "khammam" },
      { name: "Komaram Bheem Asifabad", code: "komaram-bheem-asifabad" },
      { name: "Mahabubabad", code: "mahabubabad" },
      { name: "Mahabubnagar", code: "mahabubnagar" },
      { name: "Mancherial", code: "mancherial" },
      { name: "Medak", code: "medak" },
      { name: "Medchal Malkajgiri", code: "medchal-malkajgiri" },
      { name: "Mulugu", code: "mulugu" },
      { name: "Nagarkurnool", code: "nagarkurnool" },
      { name: "Nalgonda", code: "nalgonda" },
      { name: "Narayanpet", code: "narayanpet" },
      { name: "Nirmal", code: "nirmal" },
      { name: "Nizamabad", code: "nizamabad" },
      { name: "Peddapalli", code: "peddapalli" },
      { name: "Rajanna Sircilla", code: "rajanna-sircilla" },
      { name: "Rangareddy", code: "rangareddy" },
      { name: "Sangareddy", code: "sangareddy" },
      { name: "Siddipet", code: "siddipet" },
      { name: "Suryapet", code: "suryapet" },
      { name: "Vikarabad", code: "vikarabad" },
      { name: "Wanaparthy", code: "wanaparthy" },
      { name: "Warangal Rural", code: "warangal-rural" },
      { name: "Warangal Urban", code: "warangal-urban" },
      { name: "Yadadri Bhuvanagiri", code: "yadadri-bhuvanagiri" }
    ]
  },
  {
    name: "Tripura",
    code: "TR",
    districts: [
      { name: "Dhalai", code: "dhalai" },
      { name: "Gomati", code: "gomati" },
      { name: "Khowai", code: "khowai" },
      { name: "North Tripura", code: "north-tripura" },
      { name: "Sepahijala", code: "sepahijala" },
      { name: "South Tripura", code: "south-tripura" },
      { name: "Unakoti", code: "unakoti" },
      { name: "West Tripura", code: "west-tripura" }
    ]
  },
  {
    name: "Uttar Pradesh",
    code: "UP",
    districts: [
      { name: "Agra", code: "agra" },
      { name: "Aligarh", code: "aligarh" },
      { name: "Ambedkar Nagar", code: "ambedkar-nagar" },
      { name: "Amethi", code: "amethi" },
      { name: "Amroha", code: "amroha" },
      { name: "Auraiya", code: "auraiya" },
      { name: "Ayodhya", code: "ayodhya" },
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
    name: "Uttarakhand",
    code: "UK",
    districts: [
      { name: "Almora", code: "almora" },
      { name: "Bageshwar", code: "bageshwar" },
      { name: "Chamoli", code: "chamoli" },
      { name: "Champawat", code: "champawat" },
      { name: "Dehradun", code: "dehradun" },
      { name: "Haridwar", code: "haridwar" },
      { name: "Nainital", code: "nainital" },
      { name: "Pauri Garhwal", code: "pauri-garhwal" },
      { name: "Pithoragarh", code: "pithoragarh" },
      { name: "Rudraprayag", code: "rudraprayag" },
      { name: "Tehri Garhwal", code: "tehri-garhwal" },
      { name: "Udham Singh Nagar", code: "udham-singh-nagar" },
      { name: "Uttarkashi", code: "uttarkashi" }
    ]
  },
  {
    name: "West Bengal",
    code: "WB",
    districts: [
      { name: "Alipurduar", code: "alipurduar" },
      { name: "Bankura", code: "bankura" },
      { name: "Birbhum", code: "birbhum" },
      { name: "Cooch Behar", code: "cooch-behar" },
      { name: "Dakshin Dinajpur", code: "dakshin-dinajpur" },
      { name: "Darjeeling", code: "darjeeling" },
      { name: "Hooghly", code: "hooghly" },
      { name: "Howrah", code: "howrah" },
      { name: "Jalpaiguri", code: "jalpaiguri" },
      { name: "Jhargram", code: "jhargram" },
      { name: "Kalimpong", code: "kalimpong" },
      { name: "Kolkata", code: "kolkata" },
      { name: "Malda", code: "malda" },
      { name: "Murshidabad", code: "murshidabad" },
      { name: "Nadia", code: "nadia" },
      { name: "North 24 Parganas", code: "north-24-parganas" },
      { name: "Paschim Bardhaman", code: "paschim-bardhaman" },
      { name: "Paschim Medinipur", code: "paschim-medinipur" },
      { name: "Purba Bardhaman", code: "purba-bardhaman" },
      { name: "Purba Medinipur", code: "purba-medinipur" },
      { name: "Purulia", code: "purulia" },
      { name: "South 24 Parganas", code: "south-24-parganas" },
      { name: "Uttar Dinajpur", code: "uttar-dinajpur" }
    ]
  },
  {
    name: "Andaman and Nicobar Islands",
    code: "AN",
    districts: [
      { name: "Nicobar", code: "nicobar" },
      { name: "North and Middle Andaman", code: "north-middle-andaman" },
      { name: "South Andaman", code: "south-andaman" }
    ]
  },
  {
    name: "Chandigarh",
    code: "CH",
    districts: [
      { name: "Chandigarh", code: "chandigarh" }
    ]
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    code: "DN",
    districts: [
      { name: "Dadra and Nagar Haveli", code: "dadra-nagar-haveli" },
      { name: "Daman", code: "daman" },
      { name: "Diu", code: "diu" }
    ]
  },
  {
    name: "Jammu and Kashmir",
    code: "JK",
    districts: [
      { name: "Anantnag", code: "anantnag" },
      { name: "Bandipore", code: "bandipore" },
      { name: "Baramulla", code: "baramulla" },
      { name: "Budgam", code: "budgam" },
      { name: "Doda", code: "doda" },
      { name: "Ganderbal", code: "ganderbal" },
      { name: "Jammu", code: "jammu" },
      { name: "Kathua", code: "kathua" },
      { name: "Kishtwar", code: "kishtwar" },
      { name: "Kulgam", code: "kulgam" },
      { name: "Kupwara", code: "kupwara" },
      { name: "Poonch", code: "poonch" },
      { name: "Pulwama", code: "pulwama" },
      { name: "Rajouri", code: "rajouri" },
      { name: "Ramban", code: "ramban" },
      { name: "Reasi", code: "reasi" },
      { name: "Samba", code: "samba" },
      { name: "Shopian", code: "shopian" },
      { name: "Srinagar", code: "srinagar" },
      { name: "Udhampur", code: "udhampur" }
    ]
  },
  {
    name: "Ladakh",
    code: "LA",
    districts: [
      { name: "Kargil", code: "kargil" },
      { name: "Leh", code: "leh" }
    ]
  },
  {
    name: "Lakshadweep",
    code: "LD",
    districts: [
      { name: "Lakshadweep", code: "lakshadweep" }
    ]
  },
  {
    name: "Puducherry",
    code: "PY",
    districts: [
      { name: "Karaikal", code: "karaikal" },
      { name: "Mahe", code: "mahe" },
      { name: "Puducherry", code: "puducherry" },
      { name: "Yanam", code: "yanam" }
    ]
  }
];

