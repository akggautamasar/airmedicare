import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavbarDesktopMenu } from "./NavbarDesktopMenu";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { User } from "@supabase/supabase-js";

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

          <NavbarDesktopMenu
            language={language}
            setLanguage={setLanguage}
            user={user as User}
            logout={logout}
          />

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <NavbarMobileMenu
        isOpen={isOpen}
        language={language}
        setLanguage={setLanguage}
        user={user as User}
        logout={logout}
      />
    </nav>
  );
};