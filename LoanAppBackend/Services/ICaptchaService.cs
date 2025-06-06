namespace LoanAppBackend.Services
{
    public interface ICaptchaService
    {
        Task<bool> VerifyTokenAsync(string captchaToken);
    }
}