using LoanAppBackend.Data;
using LoanAppBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanAppBackend.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _dbcontext;
        public UserRepository(AppDbContext appDbContext) 
        {
            _dbcontext = appDbContext;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbcontext.Users.ToListAsync();
        }

        // Get by email
        public async Task<User> GetByEmail(string email)
        {
            return await _dbcontext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbcontext.Users.FindAsync(id);
        }
    }
}
