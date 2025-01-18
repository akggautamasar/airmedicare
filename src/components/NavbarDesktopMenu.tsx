import { Button } from "@/components/ui/button";
import { Globe, Heart, Hospital } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginModal } from "./LoginModal";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages, LanguageCode } from "@/utils/languages";

interface NavbarDesktopMenuProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
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
      <Link to="/health-tips">
        <Button variant="ghost">
          <Heart className="h-4 w-4 mr-2" />
          Quick Health Tips
        </Button>
      </Link>
      <Link to="/find-facilities">
        <Button variant="ghost">
          <Hospital className="h-4 w-4 mr-2" />
          Find Healthcare Facilities
        </Button>
      </Link>
      <Link to="/find-doctors">
        <Button variant="ghost">Find Doctors</Button>
      </Link>
      <Link to="/book-appointment">
        <Button variant="ghost">Book Appointment</Button>
      </Link>
      <Link to="/buy-medicine">
        <Button variant="ghost">Buy Medicines</Button>
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex justify-between ${
                language === lang.code ? "bg-accent" : ""
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-muted-foreground">{lang.nativeName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Hello, {user.user_metadata?.name || user.email?.split("@")[0]}
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