namespace LoanAppBackend.DTO
{
    public class LoanApplicationDTO
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int TermInMonths { get; set; }
        public decimal MonthlyIncome { get; set; }  // Used for loan application
        public int CreditScore { get; set; }        // Used for loan application

        // Status, AdminRemarks, ApplicationDate, FullName, and Email are required for response
        public string Status { get; set; }
        public string? AdminRemarks { get; set; }
        public DateTime ApplicationDate { get; set; }

        // User details for the response
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
