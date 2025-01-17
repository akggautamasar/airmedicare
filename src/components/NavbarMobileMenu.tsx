import { Button } from "@/components/ui/button";
import { Globe, Heart, Hospital } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginModal } from "./LoginModal";
import { User } from "@supabase/supabase-js";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  user: User | null;
  logout: () => void;
}

export const NavbarMobileMenu = ({
  isOpen,
  language,
  setLanguage,
  user,
  logout,
}: NavbarMobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          <Heart className="h-4 w-4 mr-2" />
          Quick Health Tips
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Hospital className="h-4 w-4 mr-2" />
          Find Healthcare Facilities
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Find Doctors
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Book Appointment
        </Button>
        <Link to="/buy-medicine" className="block w-full">
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
          <div className="space-y-2">
            <span className="block px-4 py-2 text-sm text-gray-600">
              Hello, {user.email?.split('@')[0]}
            </span>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <LoginModal />
        )}
      </div>
    </div>
  );
};