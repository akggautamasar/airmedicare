import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { LoginModal } from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-medical-primary">
                Airmedicare
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Button variant="ghost">Find Doctors</Button>
            <Button variant="ghost">Book Appointment</Button>
            <Link to="/buy-medicine">
              <Button variant="ghost">Buy Medicines</Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              <Globe className="h-4 w-4" />
            </Button>
            {user ? (
              <>
                <span className="text-gray-600">Hello, {user.name || user.email}</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <LoginModal />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            <Link to="/buy-medicine">
              <Button variant="ghost" className="w-full justify-start">
                Buy Medicines
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>
            {user ? (
              <>
                <span className="block px-4 py-2 text-gray-600">
                  Hello, {user.name || user.email}
                </span>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <LoginModal />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};