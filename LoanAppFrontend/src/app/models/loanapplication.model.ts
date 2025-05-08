export interface LoanApplication {
  id: number;
  amount: number;
  termInMonths: number;
  monthlyIncome: number;
  creditScore: number;
  status: string;
  adminRemarks?: string | null;
  applicationDate: string;
  fullName: string;
  email: string;
}

