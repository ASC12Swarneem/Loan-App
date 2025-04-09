namespace LoanAppBackend.DTO
{
    public class UpdateLoanDTO
    {
        public string Status { get; set; } = "Pending"; // Admin updates to Approved / Rejected
        public string? AdminRemarks { get; set; }
    }

}
