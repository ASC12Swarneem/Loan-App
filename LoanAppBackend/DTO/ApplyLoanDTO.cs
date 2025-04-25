namespace LoanAppBackend.DTO
{
    public class ApplyLoanDTO
    {
        public decimal Amount { get; set; }
        public int TermInMonths { get; set; }
        public decimal MonthlyIncome { get; set; }
        public int CreditScore { get; set; }
    }
}
