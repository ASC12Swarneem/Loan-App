using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoanAppBackend.Models
{
    [Table("LoanApplications")]
    public class LoanApplication
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public int TermInMonths { get; set; } 

        [Required]
        [Range(5000, double.MaxValue, ErrorMessage = "Monthly income must be at least 5000")]
        public decimal MonthlyIncome { get; set; }

        [Required]
        [Range(625, 850, ErrorMessage = "Credit score must be between 300 and 850")]
        public int CreditScore { get; set; }

        public string Status { get; set; } = "Pending"; 
        public string? AdminRemarks { get; set; }

        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

        // FK
  
        public int UserId { get; set; }

        // Navigation
        public User User { get; set; }
    }
}
