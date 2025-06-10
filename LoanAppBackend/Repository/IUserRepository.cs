using LoanAppBackend.Models;

namespace LoanAppBackend.Repository
{
    public interface IUserRepository
    {
        Task<User> GetByEmail(string email);
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
    }
}
