using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoanAppBackend.Models
{

        [Table("Users")]
        public class User
        {
            [Key]
            public int Id { get; set; }

            [Required(ErrorMessage = "Full name is required")]
            [MaxLength(100)]
            public string FullName { get; set; }

            [Required(ErrorMessage = "Email is required")]
            [EmailAddress]
            [MaxLength(100)]
            public string Email { get; set; }

            [Required]
            public byte[] PasswordHash { get; set; }

            [Required]
            public byte[] PasswordSalt { get; set; }


            [Required]  
            [RegularExpression("Admin|User", ErrorMessage = "Role must be either Admin or User")]
            public string Role { get; set; } = "User";

            public ICollection<LoanApplication> LoanApplications { get; set; }
        }
}
