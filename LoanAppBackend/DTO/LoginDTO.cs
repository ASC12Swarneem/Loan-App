namespace LoanAppBackend.DTO
{
    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string CaptchaToken { get; set; } = string.Empty;
    }   
}
