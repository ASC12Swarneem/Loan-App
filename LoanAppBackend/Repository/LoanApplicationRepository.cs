using LoanAppBackend.Data;
using LoanAppBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanAppBackend.Repository
{
    public class LoanApplicationRepository : ILoanApplicationRepository
    {
        private readonly AppDbContext _dbContext;

        public LoanApplicationRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<LoanApplication> ApplyAsync(LoanApplication loanApplication)
        {
            _dbContext.LoanApplications.Add(loanApplication);
            await _dbContext.SaveChangesAsync();
            return loanApplication;
        }


        public async Task<IEnumerable<LoanApplication>> GetAllLoansAsync()
        {
            return await _dbContext.LoanApplications.Include(l => l.User).ToListAsync();
        }

        public async Task<IEnumerable<LoanApplication>> GetAllLoansAsync(int userId)
        {
            return await _dbContext.LoanApplications.Include(l => l.User).ToListAsync();
        }

        public async Task<LoanApplication?> GetByIdAsync(int id)
        {
            return await _dbContext.LoanApplications.Include(l => l.User).FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<LoanApplication>> GetLoanByUerIdAsync(int userId)
        {
            return await _dbContext.LoanApplications
            .Include(loan => loan.User) 
            .Where(loan => loan.UserId == userId)
            .ToListAsync();
        }

        public async Task UpdateLoanAsync(LoanApplication loan)
        {
            _dbContext.Entry(loan).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }
    }
}
