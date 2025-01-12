import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Hero = () => {
  return (
    <div className="bg-medical-light py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
          Your Health, Our Priority
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Find and book appointments with the best doctors near you. Access quality healthcare at your fingertips.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
          <Button className="bg-medical-primary hover:bg-medical-dark flex-1">
            <Search className="mr-2 h-4 w-4" />
            Find Doctors
          </Button>
          <Button variant="outline" className="flex-1">
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};