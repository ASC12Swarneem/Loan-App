using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using LoanAppBackend.DTO;
using LoanAppBackend.Models;
using LoanAppBackend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LoanAppBackend.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly ILoanApplicationRepository _loanApplicationRepository;


        public LoanController(ILoanApplicationRepository loanApplicationRepository)
        {
            _loanApplicationRepository = loanApplicationRepository;
        }

        [HttpPost("apply")]
        [Authorize]
        public async Task<IActionResult> ApplyLoan([FromBody] ApplyLoanDTO loanDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var newLoan = new LoanApplication
            {
                Amount = loanDto.Amount,
                TermInMonths = loanDto.TermInMonths,
                MonthlyIncome = loanDto.MonthlyIncome,
                CreditScore = loanDto.CreditScore,
                Status = "Pending",
                ApplicationDate = DateTime.UtcNow,
                UserId = userId
            };

            var result = await _loanApplicationRepository.ApplyAsync(newLoan);
            return Ok(result);
        }


        [HttpGet("my-loans")]
        [Authorize]
        public async Task<IActionResult> GetMyLoans()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var loans = await _loanApplicationRepository.GetLoanByUerIdAsync(userId);

            var loanDtos = loans.Select(loan => new LoanApplicationDTO
            {
                Id = loan.Id,
                Amount = loan.Amount,
                TermInMonths = loan.TermInMonths,
                Status = loan.Status,
                AdminRemarks = loan.AdminRemarks,
                MonthlyIncome = loan.MonthlyIncome,
                CreditScore = loan.CreditScore,
                ApplicationDate = loan.ApplicationDate,
                FullName = loan.User.FullName,  
                Email = loan.User.Email        
            }).ToList();

            return Ok(loanDtos);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllLoans()

        {
            var userId = GetUserIdFromToken();
            var loans = await _loanApplicationRepository.GetAllLoansAsync();

            var loanDtos = loans.Select(loan => new LoanApplicationDTO
            {
                Id = loan.Id,
                Amount = loan.Amount,
                TermInMonths = loan.TermInMonths,
                MonthlyIncome = loan.MonthlyIncome,
                Status = loan.Status,
                AdminRemarks = loan.AdminRemarks,
                ApplicationDate = loan.ApplicationDate,
                FullName = loan.User?.FullName ?? "Unknown",
                Email = loan.User?.Email ?? "Unknown"
            }).ToList();

            return Ok(loanDtos);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLoan(int id, [FromBody] UpdateLoanDTO dto)
        {
            var existingLoan = await _loanApplicationRepository.GetByIdAsync(id);
            if (existingLoan == null)
                return NotFound("Loan not found");

            existingLoan.Status = dto.Status;
            existingLoan.AdminRemarks = dto.AdminRemarks;

            await _loanApplicationRepository.UpdateLoanAsync(existingLoan);
            return Ok("Loan status updated");
        }


        [HttpGet("user-dashboard")]
        [Authorize]
        public async Task<IActionResult> GetUserDashboard()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var loans = await _loanApplicationRepository.GetLoanByUerIdAsync(userId);

            var loanDtos = loans.Select(loan => new LoanApplicationDTO
            {
                Id = loan.Id,
                Amount = loan.Amount,
                TermInMonths = loan.TermInMonths,
                Status = loan.Status,
                MonthlyIncome = loan.MonthlyIncome,
                CreditScore = loan.CreditScore,
                AdminRemarks = loan.AdminRemarks,
                ApplicationDate = loan.ApplicationDate,
                FullName = loan.User.FullName, 
                Email = loan.User.Email 
            }).ToList();


            return Ok(loanDtos);
        }


        [HttpGet("admin-dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminDashboard(string? status = null)
        {
            var allLoans = await _loanApplicationRepository.GetAllLoansAsync();

            if (!string.IsNullOrEmpty(status))
            {
                allLoans = allLoans
                    .Where(l => string.Equals(l.Status, status, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            var loanDtos = allLoans.Select(loan => new LoanApplicationDTO
            {
                Id = loan.Id,
                Amount = loan.Amount,
                TermInMonths = loan.TermInMonths,
                Status = loan.Status,
                MonthlyIncome = loan.MonthlyIncome,
                AdminRemarks = loan.AdminRemarks,
                ApplicationDate = loan.ApplicationDate,
                FullName = loan.User?.FullName ?? "Unknown", 
                Email = loan.User?.Email ?? "Unknown"
            }).ToList();

            return Ok(loanDtos);
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing User ID in token.");
            }

            return userId;
        }
    }
}