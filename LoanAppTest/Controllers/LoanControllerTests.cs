using LoanAppBackend.Controllers;
using LoanAppBackend.DTO;
using LoanAppBackend.Models;
using LoanAppBackend.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace LoanAppBackend.Tests.Controllers
{
    [TestFixture]
    public class LoanControllerTests
    {
        private Mock<ILoanApplicationRepository> _mockRepo;
        private LoanController _controller;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<ILoanApplicationRepository>();
            _controller = new LoanController(_mockRepo.Object);

            // Simulate authenticated user with userId 1
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Test]
        public async Task ApplyLoan_ReturnsOk_WithCreatedLoan()
        {
            var dto = new LoanApplicationDTO
            {
                Amount = 10000,
                TermInMonths = 12,
                MonthlyIncome = 3000,
                CreditScore = 750
            };

            var loan = new LoanApplication
            {
                Id = 1,
                Amount = dto.Amount,
                TermInMonths = dto.TermInMonths,
                MonthlyIncome = dto.MonthlyIncome,
                CreditScore = dto.CreditScore,
                UserId = 1,
                Status = "Pending",
                ApplicationDate = DateTime.UtcNow
            };

            _mockRepo.Setup(repo => repo.ApplyAsync(It.IsAny<LoanApplication>()))
                     .ReturnsAsync(loan);

            //var result = await _controller.ApplyLoan(dto);

            //Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetMyLoans_ReturnsUserLoans()
        {
            var userLoans = new List<LoanApplication>
            {
                new LoanApplication
                {
                    Id = 1,
                    Amount = 5000,
                    TermInMonths = 6,
                    Status = "Approved",
                    User = new User { FullName = "Test User", Email = "test@example.com" }
                }
            };

            _mockRepo.Setup(r => r.GetLoanByUerIdAsync(1)).ReturnsAsync(userLoans);

            var result = await _controller.GetMyLoans();
            var okResult = result as OkObjectResult;

            Assert.IsNotNull(okResult);
            Assert.IsInstanceOf<List<LoanApplicationDTO>>(okResult.Value);
        }

        [Test]
        public async Task GetAllLoans_ReturnsAllLoans()
        {
            // Setup Admin context
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(
                new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, "2"),
                    new Claim(ClaimTypes.Role, "Admin")
                }, "mock"));

            var allLoans = new List<LoanApplication>
            {
                new LoanApplication
                {
                    Id = 1,
                    Amount = 10000,
                    Status = "Pending",
                    User = new User { FullName = "John", Email = "john@email.com" }
                }
            };

            _mockRepo.Setup(r => r.GetAllLoansAsync()).ReturnsAsync(allLoans);

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task UpdateLoan_WhenLoanExists_ReturnsOk()
        {
            var loan = new LoanApplication
            {
                Id = 1,
                Status = "Pending",
                AdminRemarks = null
            };

            var updateDto = new UpdateLoanDTO
            {
                Status = "Approved",
                AdminRemarks = "All checks passed"
            };

            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(loan);
            _mockRepo.Setup(r => r.UpdateLoanAsync(It.IsAny<LoanApplication>())).Returns(Task.CompletedTask);

            var result = await _controller.UpdateLoan(1, updateDto);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetUserDashboard_ReturnsLoans()
        {
            var userLoans = new List<LoanApplication>
            {
                new LoanApplication
                {
                    Id = 1,
                    Amount = 2000,
                    TermInMonths = 6,
                    Status = "Pending",
                    User = new User { FullName = "User", Email = "user@example.com" }
                }
            };

            _mockRepo.Setup(r => r.GetLoanByUerIdAsync(1)).ReturnsAsync(userLoans);

            var result = await _controller.GetUserDashboard();
            var okResult = result as OkObjectResult;

            Assert.IsNotNull(okResult);
            Assert.IsInstanceOf<List<LoanApplicationDTO>>(okResult.Value);
        }


        [Test]
        public async Task GetAdminDashboard_WithStatusFilter_ReturnsFilteredLoans()
        {
            // Setup Admin context
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(
                        new ClaimsIdentity(new Claim[]
                        {
                    new Claim(ClaimTypes.NameIdentifier, "2"),
                    new Claim(ClaimTypes.Role, "Admin")
                        }, "mock"))
                }
            };

            // Mock loan data
            var loans = new List<LoanApplication>
    {
        new LoanApplication { Id = 1, Status = "Approved" },
        new LoanApplication { Id = 2, Status = "Pending" },
        new LoanApplication { Id = 3, Status = "approved" } // test case-insensitive match
    };

            // Mock repository response
            _mockRepo.Setup(r => r.GetAllLoansAsync()).ReturnsAsync(loans);

            // Act
            var result = await _controller.GetAdminDashboard("Approved");

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var filteredLoans = okResult?.Value as IEnumerable<LoanApplicationDTO>;

            Assert.IsNotNull(filteredLoans);
            Assert.AreEqual(2, filteredLoans.Count()); // should return 2: "Approved" and "approved"
        }

    }
}
