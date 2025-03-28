import { Button } from "@/components/ui/button";
import { Globe, Heart, Hospital, Coins, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginModal } from "./LoginModal";
import { User } from "@supabase/supabase-js";
import { languages, LanguageCode } from "@/utils/languages";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        console.log("Mobile menu - Checking admin status for user:", user.id);
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Mobile menu - Error fetching profile:", error);
          return;
        }

        console.log("Mobile menu - User profile:", profile);
        setIsAdmin(profile?.role === "admin");
        console.log("Mobile menu - Is admin?", profile?.role === "admin");
      } catch (error) {
        console.error("Mobile menu - Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <Link to="/health-tips" className="block w-full">
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="h-4 w-4 mr-2" />
            Quick Health Tips
          </Button>
        </Link>
        <Link to="/find-facilities" className="block w-full">
          <Button variant="ghost" className="w-full justify-start">
            <Hospital className="h-4 w-4 mr-2" />
            Find Healthcare Facilities
          </Button>
        </Link>
        <Link to="/find-doctors" className="block w-full">
          <Button variant="ghost" className="w-full justify-start">
            Find Doctors
          </Button>
        </Link>
        <Link to="/book-appointment" className="block w-full">
          <Button variant="ghost" className="w-full justify-start">
            Book Appointment
          </Button>
        </Link>
        <Link to="/buy-medicine" className="block w-full">
          <Button variant="ghost" className="w-full justify-start">
            Buy Medicines
          </Button>
        </Link>
        <Link to="/medical-loan" className="block w-full">
          <Button variant="ghost" className="w-full justify-start">
            <Coins className="h-4 w-4 mr-2" />
            Medical Loan
          </Button>
        </Link>
        <Link to="/loan-status" className="block w-full">
          <Button variant="outline" className="w-full justify-start">
            Check Loan Status
          </Button>
        </Link>

        <div className="px-4 py-2 space-y-2">
          <div className="text-sm font-medium text-gray-500">Select Language</div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                size="sm"
                className="justify-between"
                onClick={() => setLanguage(lang.code)}
              >
                <span className="mr-2">{lang.name}</span>
                <span className="text-xs">{lang.nativeName}</span>
              </Button>
            ))}
          </div>
        </div>

        {user ? (
          <div className="space-y-2">
            <span className="block px-4 py-2 text-sm text-gray-600">
              Hello, {user.user_metadata?.name || user.email?.split("@")[0]}
            </span>
            {isAdmin && (
              <Link to="/admin" className="block w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
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