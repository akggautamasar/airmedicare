import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { HospitalForm } from "@/components/HospitalForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    checkAdminStatus();
    fetchHospitals();
  }, [user, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (profile?.role !== "admin") {
        navigate("/");
        toast.error("Unauthorized access");
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      toast.error(error.message);
      navigate("/");
    }
  };

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitals_data")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setHospitals(data || []);
    } catch (error: any) {
      console.error("Error fetching hospitals:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin || loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hospital Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hospital
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Hospital</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new hospital to the system.
              </DialogDescription>
            </DialogHeader>
            <HospitalForm onSuccess={fetchHospitals} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{hospital.name}</h3>
            <p className="text-gray-600 mb-2">{hospital.address}</p>
            <p className="text-gray-600 mb-2">Type: {hospital.type}</p>
            <p className="text-gray-600 mb-2">District: {hospital.district}</p>
            <p className="text-gray-600">Contact: {hospital.contact}</p>
            {hospital.emergency && (
              <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm mt-2">
                24/7 Emergency
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}