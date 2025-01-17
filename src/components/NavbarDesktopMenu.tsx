import { Button } from "@/components/ui/button";
import { Globe, Heart, Hospital } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginModal } from "./LoginModal";
import { User } from "@supabase/supabase-js";

interface NavbarDesktopMenuProps {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  user: User | null;
  logout: () => void;
}

export const NavbarDesktopMenu = ({
  language,
  setLanguage,
  user,
  logout,
}: NavbarDesktopMenuProps) => {
  return (
    <div className="hidden sm:flex sm:items-center sm:space-x-4">
      <Button variant="ghost">
        <Heart className="h-4 w-4 mr-2" />
        Quick Health Tips
      </Button>
      <Button variant="ghost">
        <Hospital className="h-4 w-4 mr-2" />
        Find Healthcare Facilities
      </Button>
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
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Hello, {user.email?.split('@')[0]}
          </span>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <LoginModal />
      )}
    </div>
  );
};