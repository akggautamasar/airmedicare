import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function AppointmentsTab() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      let query = supabase
        .from("appointments")
        .select(`
          *,
          profiles:patient_id (id)
        `)
        .order("appointment_date", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Appointment status updated successfully");
      fetchAppointments();
    } catch (error: any) {
      console.error("Error updating appointment status:", error);
      toast.error(error.message);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Appointments Management</CardTitle>
            <CardDescription>
              View and manage all appointments in the system.
            </CardDescription>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-filter">Filter by Status</Label>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {formatDate(appointment.appointment_date)}
                </TableCell>
                <TableCell>
                  {formatTime(appointment.scheduled_time)}
                </TableCell>
                <TableCell>{appointment.token_number}</TableCell>
                <TableCell>{appointment.payment_status}</TableCell>
                <TableCell>₹{appointment.payment_amount}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell className="space-x-2">
                  <Select
                    value={appointment.status}
                    onValueChange={(value) =>
                      updateAppointmentStatus(appointment.id, value)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirm</SelectItem>
                      <SelectItem value="completed">Complete</SelectItem>
                      <SelectItem value="cancelled">Cancel</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}