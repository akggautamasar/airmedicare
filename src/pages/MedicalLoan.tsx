import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";

const MedicalLoan = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Medical Loan Application</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <LoanApplicationForm />
      </div>
    </div>
  );
};

export default MedicalLoan;