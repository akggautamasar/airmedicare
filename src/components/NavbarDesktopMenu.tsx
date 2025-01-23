import { Button } from "@/components/ui/button";
import { Globe, Heart, Hospital, Coins, Settings } from "lucide-react";
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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [user]);

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
      <div className="flex items-center space-x-2">
        <Link to="/medical-loan">
          <Button variant="ghost">
            <Coins className="h-4 w-4 mr-2" />
            Medical Loan
          </Button>
        </Link>
        <Link to="/loan-status">
          <Button variant="outline" size="sm">
            Check Status
          </Button>
        </Link>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
            >
              <span className="mr-2">{lang.name}</span>
              <span className="text-xs text-gray-500">{lang.nativeName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Hello, {user.user_metadata?.name || user.email?.split("@")[0]}
          </span>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          )}
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