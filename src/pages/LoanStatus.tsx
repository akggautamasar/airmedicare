import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface LoanApplication {
  id: string;
  loan_amount: number;
  loan_purpose: string;
  loan_status: string;
  created_at: string;
  lender_name: string | null;
  interest_rate: number | null;
  tenure_months: number | null;
}

const LoanStatus = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("medical_loans")
          .select("*")
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLoans(data || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Loan Applications Status</h1>
      {loans.length === 0 ? (
        <p>No loan applications found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lender</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Tenure (Months)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>
                  {format(new Date(loan.created_at), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>₹{loan.loan_amount.toLocaleString()}</TableCell>
                <TableCell>{loan.loan_purpose}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      loan.loan_status === "approved"
                        ? "bg-green-100 text-green-800"
                        : loan.loan_status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {loan.loan_status}
                  </span>
                </TableCell>
                <TableCell>{loan.lender_name || "-"}</TableCell>
                <TableCell>
                  {loan.interest_rate ? `${loan.interest_rate}%` : "-"}
                </TableCell>
                <TableCell>{loan.tenure_months || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LoanStatus;