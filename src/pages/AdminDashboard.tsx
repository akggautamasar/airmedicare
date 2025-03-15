
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
import { HealthTipsTab } from "@/components/admin/HealthTipsTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
      console.log("Checking admin status in AdminDashboard component for user:", user?.id);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status in AdminDashboard:", error);
        throw error;
      }

      console.log("Profile data in AdminDashboard:", profile);
      if (profile?.role !== "admin") {
        console.log("User is not admin, redirecting to home");
        navigate("/");
        toast.error("You don't have admin privileges");
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      toast.error(error.message);
      navigate("/");
    } finally {
      setLoading(false);
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
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading admin dashboard...</div>;
  }

  if (!isAdmin) {
    return <div className="p-8 text-center">You need admin privileges to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="hospitals" className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <TabsList>
              <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="loans">Medical Loans</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="health-tips">Health Tips</TabsTrigger>
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

        <TabsContent value="health-tips">
          <HealthTipsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
