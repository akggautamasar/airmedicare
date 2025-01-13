import { Calendar, Search, Stethoscope, Pill, FileText, Truck, Heart, Receipt } from "lucide-react";

const features = [
  {
    name: "Find Doctors",
    description: "Search from over 1000+ doctors across 50+ specialties. Read patient reviews and book appointments instantly.",
    icon: Search,
  },
  {
    name: "Medicine Delivery",
    description: "Order medicines online and get them delivered to your doorstep within 2 hours. Track your delivery in real-time.",
    icon: Truck,
  },
  {
    name: "Health Records",
    description: "Store and access your medical records, prescriptions, and lab reports securely. Share them with doctors instantly.",
    icon: FileText,
  },
  {
    name: "Medicine Database",
    description: "Browse through 10,000+ medicines with detailed information about dosage, side effects, and pricing. Find nearby pharmacies.",
    icon: Pill,
  },
  {
    name: "Lab Tests",
    description: "Book lab tests online and get samples collected from your home. Get reports digitally within 24 hours.",
    icon: Stethoscope,
  },
  {
    name: "Health Monitor",
    description: "Track your vital health metrics, set medication reminders, and get personalized health insights.",
    icon: Heart,
  },
  {
    name: "Prescriptions",
    description: "Upload your prescriptions and get medicines delivered. Auto-refill option available for regular medications.",
    icon: Receipt,
  },
  {
    name: "Appointments",
    description: "Book doctor appointments, lab tests, and health checkups. Get instant confirmations and reminders.",
    icon: Calendar,
  },
];

export const Features = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Complete Healthcare Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your one-stop destination for all healthcare needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-medical-light flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-medical-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};