using LoanAppBackend.Controllers;
using LoanAppBackend.DTO;
using LoanAppBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace LoanAppTest.Controllers
{
    internal class AuthControllerTests
    {
        private Mock<IAuthService> _mockAuthService;
        private AuthController _authController;

        [SetUp]
        public void Setup()
        {
            _mockAuthService = new Mock<IAuthService>();
            _authController = new AuthController(_mockAuthService.Object);
        }

        [Test]
        public async Task Register_IfRegister_ReturnOk()
        {
            var registerDTO = new RegisterDTO
            {
                Email = "test@ok.com",
                Password = "Password"
            };

            // Mocking the service method return value
            _mockAuthService.Setup(s => s.RegisterAsync(registerDTO)).ReturnsAsync("User Registered Successfully!");

            // Act
            var result = await _authController.Register(registerDTO);
            var okResult = result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            // Using dynamic to access message property
            dynamic response = okResult.Value;
            Assert.AreEqual("User Registered Successfully!", response.Message);
        }

        [Test]
        public async Task Register_WhenFails_ReturnsBadRequest()
        {
            var registerDTO = new RegisterDTO
            {
                Email = "existing@example.com",
                Password = "pass"
            };

            // Mocking the service method return value
            _mockAuthService.Setup(s => s.RegisterAsync(registerDTO)).ReturnsAsync("Email already exists");

            // Act
            var result = await _authController.Register(registerDTO);
            var badRequest = result as BadRequestObjectResult;

            // Assert
            Assert.IsNotNull(badRequest);
            Assert.AreEqual(400, badRequest.StatusCode);

            // Using dynamic to access message property
            dynamic response = badRequest.Value;
            Assert.AreEqual("Email already exists", response.message);
        }

        [Test]
        public async Task Login_WhenValidCredentials_ReturnsTokenAndRole()
        {
            var loginDTO = new LoginDTO
            {
                Email = "test@example.com",
                Password = "Test@123"
            };

            // Mocking the service method return value
            _mockAuthService.Setup(s => s.LoginAsync(loginDTO)).ReturnsAsync("mock-jwt-token");

            // Act
            var result = await _authController.Login(loginDTO);
            var okResult = result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            // Assert the strongly-typed response DTO
            var response = okResult.Value as LoginResponseDTO;
            Assert.IsNotNull(response);
            Assert.AreEqual("mock-jwt-token", response.Token);
            Assert.AreEqual("User", response.Role);
        }

        [Test]
        public async Task Login_WhenInvalidCredentials_ReturnsUnauthorized()
        {
            var loginDTO = new LoginDTO
            {
                Email = "wrong@example.com",
                Password = "wrongpass"
            };

            _mockAuthService.Setup(s => s.LoginAsync(loginDTO)).ReturnsAsync("Invalid Credentials");

            // Act
            var result = await _authController.Login(loginDTO);
            var unauthorized = result as UnauthorizedObjectResult;

            // Assert
            Assert.IsNotNull(unauthorized);
            Assert.AreEqual(401, unauthorized.StatusCode);

            // Use the correct property name (Message) here
            dynamic response = unauthorized.Value;
            Assert.AreEqual("Invalid Credentials", response.Message);
        }

    }
}
