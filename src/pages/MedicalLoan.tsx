import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MedicalLoan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to apply for a loan");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("medical_loans").insert({
        patient_id: user.id,
        loan_amount: parseFloat(loanAmount),
        loan_purpose: loanPurpose,
        monthly_income: parseFloat(monthlyIncome),
        employment_status: employmentStatus,
      });

      if (error) throw error;

      toast.success("Loan application submitted successfully!");
      navigate("/loan-status");
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("Failed to submit loan application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Medical Loan Application</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanPurpose">Loan Purpose</Label>
          <Input
            id="loanPurpose"
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            placeholder="Describe the purpose of the loan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="Enter your monthly income"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentStatus">Employment Status</Label>
          <Select
            value={employmentStatus}
            onValueChange={setEmploymentStatus}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="business">Business Owner</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Apply for Loan"}
        </Button>
      </form>
    </div>
  );
};

export default MedicalLoan;