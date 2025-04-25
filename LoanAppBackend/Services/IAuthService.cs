using LoanAppBackend.DTO;
using LoanAppBackend.Models;

namespace LoanAppBackend.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDTO registerDto);
        Task<string> LoginAsync(LoginDTO loginDto);
        Task<User> GetUserByEmailAsync(string email);
    }
}
