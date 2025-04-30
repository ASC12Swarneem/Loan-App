namespace LoanAppBackend.DTO
{
    public class LoanApplicationDTO
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int TermInMonths { get; set; }
        public decimal MonthlyIncome { get; set; } 
        public int CreditScore { get; set; }
        public string Status { get; set; }
        public string? AdminRemarks { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
