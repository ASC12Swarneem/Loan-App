using LoanAppBackend.DTO;

namespace LoanAppBackend.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDTO registerDto);
        Task<string> LoginAsync(LoginDTO loginDto);
    }
}
