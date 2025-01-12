import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-medical-primary">Airmedicare</span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Button variant="ghost">Find Doctors</Button>
            <Button variant="ghost">Book Appointment</Button>
            <Button variant="ghost">Medicines</Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Find Doctors
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Book Appointment
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Medicines
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};