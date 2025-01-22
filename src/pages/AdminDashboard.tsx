import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const handleDeleteHospital = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;

    try {
      const { error } = await supabase
        .from("hospitals_data")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Hospital deleted successfully");
      fetchHospitals();
    } catch (error: any) {
      console.error("Error deleting hospital:", error);
      toast.error(error.message);
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

        <TabsContent value="hospitals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hospitals Management</CardTitle>
              <CardDescription>
                Manage all hospitals in the system. Add, edit, or remove hospitals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">
                        {hospital.name}
                      </TableCell>
                      <TableCell>{hospital.type}</TableCell>
                      <TableCell>{hospital.district}</TableCell>
                      <TableCell>{hospital.contact}</TableCell>
                      <TableCell>
                        {hospital.emergency ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedHospital(hospital);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteHospital(hospital.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointments Management</CardTitle>
              <CardDescription>
                Coming soon: Manage all appointments in the system.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Medical Loans Management</CardTitle>
              <CardDescription>
                Coming soon: Manage all medical loan applications.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Coming soon: Manage all users in the system.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Hospital</DialogTitle>
            <DialogDescription>
              Update the hospital information.
            </DialogDescription>
          </DialogHeader>
          <HospitalForm
            onSuccess={() => {
              fetchHospitals();
              setIsEditDialogOpen(false);
            }}
            initialData={selectedHospital}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}