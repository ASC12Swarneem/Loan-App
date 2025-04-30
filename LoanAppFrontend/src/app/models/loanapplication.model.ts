// export interface LoanApplication {
//   id: number;
//   amount: number;
//   TermInMonths: number;
//   interestRate: number;
//   status: string;
//   ApplicationDate: string;
//   userId?: number; 
//   }
  
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

