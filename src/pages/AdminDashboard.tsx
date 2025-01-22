import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HospitalsTab } from "@/components/admin/HospitalsTab";
import { AppointmentsTab } from "@/components/admin/AppointmentsTab";
import { LoansTab } from "@/components/admin/LoansTab";
import { UsersTab } from "@/components/admin/UsersTab";

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
      <Tabs defaultValue="hospitals" className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <TabsList>
              <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="loans">Medical Loans</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="hospitals">
          <HospitalsTab hospitals={hospitals} onRefetch={fetchHospitals} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>

        <TabsContent value="loans">
          <LoansTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}