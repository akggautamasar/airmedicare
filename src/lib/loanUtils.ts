export const calculateEMI = (
  principal: number,
  interestRate: number,
  tenureMonths: number
): number => {
  const monthlyRate = interestRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

export const validateLoanApplication = (
  loanAmount: number,
  monthlyIncome: number
): { isValid: boolean; message: string } => {
  if (loanAmount <= 0) {
    return { isValid: false, message: "Loan amount must be greater than 0" };
  }

  if (monthlyIncome <= 0) {
    return { isValid: false, message: "Monthly income must be greater than 0" };
  }

  // Basic eligibility check: loan amount should not exceed 10 times monthly income
  if (loanAmount > monthlyIncome * 10) {
    return {
      isValid: false,
      message: "Loan amount cannot exceed 10 times your monthly income",
    };
  }

  return { isValid: true, message: "" };
};