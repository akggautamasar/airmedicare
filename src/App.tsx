import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import BuyMedicine from "./pages/BuyMedicine";
import HealthTips from "./pages/HealthTips";
import FindFacilities from "./pages/FindFacilities";
import FindDoctors from "./pages/FindDoctors";
import BookAppointment from "./pages/BookAppointment";
import MedicalLoan from "./pages/MedicalLoan";
import LoanStatus from "./pages/LoanStatus";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

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
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;