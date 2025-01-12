import { Calendar, Search, Stethoscope, Pill } from "lucide-react";

const features = [
  {
    name: "Find Doctors",
    description: "Search from over 1000+ doctors across 50+ specialties. Read patient reviews and book appointments instantly.",
    icon: Search,
  },
  {
    name: "Book Appointments",
    description: "Choose from available time slots and schedule appointments with top doctors. Get instant confirmation via SMS and email.",
    icon: Calendar,
  },
  {
    name: "Health Information",
    description: "Access detailed information about 500+ diseases, symptoms, and treatments. Get expert medical advice and tips.",
    icon: Stethoscope,
  },
  {
    name: "Medicine Database",
    description: "Browse through 10,000+ medicines with detailed information about dosage, side effects, and pricing. Find nearby pharmacies.",
    icon: Pill,
  },
];

export const Features = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trusted by over 100,000+ users and 1000+ healthcare providers
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