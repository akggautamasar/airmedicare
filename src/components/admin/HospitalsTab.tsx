import { useState } from "react";
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

interface HospitalsTabProps {
  hospitals: any[];
  onRefetch: () => void;
}

export function HospitalsTab({ hospitals, onRefetch }: HospitalsTabProps) {
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteHospital = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;

    try {
      const { error } = await supabase
        .from("hospitals_data")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Hospital deleted successfully");
      onRefetch();
    } catch (error: any) {
      console.error("Error deleting hospital:", error);
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Hospitals Management</CardTitle>
            <CardDescription>
              Manage all hospitals in the system. Add, edit, or remove hospitals.
            </CardDescription>
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
              <HospitalForm onSuccess={onRefetch} />
            </DialogContent>
          </Dialog>
        </div>
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
              onRefetch();
              setIsEditDialogOpen(false);
            }}
            initialData={selectedHospital}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}