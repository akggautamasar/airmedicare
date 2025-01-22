import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

export function LoansTab() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const fetchLoans = async () => {
    try {
      let query = supabase
        .from("medical_loans")
        .select(`
          *,
          profiles:patient_id (id)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("loan_status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLoans(data || []);
    } catch (error: any) {
      console.error("Error fetching loans:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLoanStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("medical_loans")
        .update({ loan_status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Loan status updated successfully");
      fetchLoans();
    } catch (error: any) {
      console.error("Error updating loan status:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Medical Loans Management</CardTitle>
            <CardDescription>
              View and manage all medical loan applications.
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Monthly Income</TableHead>
              <TableHead>Employment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>₹{loan.loan_amount}</TableCell>
                <TableCell>{loan.loan_purpose}</TableCell>
                <TableCell>₹{loan.monthly_income}</TableCell>
                <TableCell>{loan.employment_status}</TableCell>
                <TableCell>{loan.loan_status}</TableCell>
                <TableCell className="space-x-2">
                  <Select
                    value={loan.loan_status}
                    onValueChange={(value) =>
                      updateLoanStatus(loan.id, value)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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