using LoanAppBackend.Models;

namespace LoanAppBackend.Repository
{
    public interface ILoanApplicationRepository
    {
        Task<LoanApplication> ApplyAsync(LoanApplication loanApplication);
        Task<IEnumerable<LoanApplication>> GetAllLoansAsync();
        Task<IEnumerable<LoanApplication>> GetAllLoansAsync(int userId);
        Task<IEnumerable<LoanApplication>> GetLoanByUerIdAsync(int userId);
        Task<LoanApplication?> GetByIdAsync(int id);
        Task UpdateLoanAsync(LoanApplication loan);

    }
}
