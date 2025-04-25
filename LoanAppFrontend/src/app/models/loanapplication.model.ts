export interface LoanApplication {
  id: number;
  amount: number;
  TermInMonths: number;
  interestRate: number;
  status: string;
  ApplicationDate: string;
  userId?: number; 
  }
  

