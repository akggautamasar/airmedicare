
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import BuyMedicine from "./pages/BuyMedicine";
import HealthTips from "./pages/HealthTips";
import FindFacilities from "./pages/FindFacilities";
import FindDoctors from "./pages/FindDoctors";
import BookAppointment from "./pages/BookAppointment";
import MedicalLoan from "./pages/MedicalLoan";
import LoanStatus from "./pages/LoanStatus";
import AdminDashboard from "./pages/AdminDashboard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

// Protected route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Checking admin status for user ID:", user.id);
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking admin access:", error);
          throw error;
        }

        console.log("Admin check profile data:", profile);
        setIsAdmin(profile?.role === "admin");
      } catch (error: any) {
        console.error("Error checking admin status:", error);
        toast.error("Error checking admin status: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Checking admin access...</div>;
  }

  if (!user) {
    toast.error("Please log in to access the admin dashboard");
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    console.log("User is not an admin, redirecting");
    toast.error("You don't have admin privileges");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buy-medicine" element={<BuyMedicine />} />
            <Route path="/health-tips" element={<HealthTips />} />
            <Route path="/find-facilities" element={<FindFacilities />} />
            <Route path="/find-doctors" element={<FindDoctors />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/medical-loan" element={<MedicalLoan />} />
            <Route path="/loan-status" element={<LoanStatus />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
