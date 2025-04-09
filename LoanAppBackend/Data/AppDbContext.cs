using LoanAppBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanAppBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<LoanApplication> LoanApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Relationships
            modelBuilder.Entity<LoanApplication>()
                .HasOne(la => la.User)              // Specify the navigation property explicitly
                .WithMany(u => u.LoanApplications)  // Specify the navigation property in User
                .HasForeignKey(la => la.UserId)     // Foreign key property
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete if needed
        }
    }
}
