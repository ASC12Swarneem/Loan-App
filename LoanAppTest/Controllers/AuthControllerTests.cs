using LoanAppBackend.Controllers;
using LoanAppBackend.DTO;
using LoanAppBackend.Models;
using LoanAppBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
            //_authController = new AuthController(_mockAuthService.Object);
        }


        [Test]
        public async Task Register_IfRegister_ReturnOk()
        {
            var registerDTO = new RegisterDTO
            {
                FullName = "Test User",
                Email = "test@ok.com",
                Password = "Password123",
                Role = "User"
            };

            _mockAuthService
                .Setup(s => s.RegisterAsync(registerDTO))
                .ReturnsAsync("User Registered Successfully!");

            // Act
            var result = await _authController.Register(registerDTO);
            var okResult = result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            // Deserialize anonymously returned object to dictionary
            var responseJson = JsonConvert.SerializeObject(okResult.Value);
            var responseDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(responseJson);

            Assert.IsNotNull(responseDict);
            Assert.IsTrue(responseDict.ContainsKey("message"));
            Assert.AreEqual("User Registered Successfully!", responseDict["message"]);
        }

        [Test]
        public async Task Register_WhenFails_ReturnsBadRequest()
        {
            var registerDTO = new RegisterDTO
            {
                Email = "existing@example.com",
                Password = "pass"
            };

            _mockAuthService.Setup(s => s.RegisterAsync(registerDTO)).ReturnsAsync("Email already exists");

            var result = await _authController.Register(registerDTO);
            var badRequest = result as BadRequestObjectResult;

            Assert.IsNotNull(badRequest);
            Assert.AreEqual(400, badRequest.StatusCode);

            var response = JObject.FromObject(badRequest.Value);
            Assert.IsNotNull(response);
            Assert.AreEqual("Email already exists", response["message"].ToString());

        }


        [Test]
        public async Task Login_WhenValidCredentials_ReturnsTokenAndRole()
        {
            var loginDTO = new LoginDTO
            {
                Email = "test@example.com",
                Password = "Test@123"
            };

            _mockAuthService.Setup(s => s.LoginAsync(loginDTO)).ReturnsAsync("mock-jwt-token");

            _mockAuthService.Setup(s => s.GetUserByEmailAsync(loginDTO.Email)).ReturnsAsync(new User
            {
                Id = 1,
                Role = "User",
                Email = loginDTO.Email
            });

            var result = await _authController.Login(loginDTO);
            var okResult = result as OkObjectResult;

            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var response = okResult.Value as LoginResponseDTO;
            Assert.IsNotNull(response);
            Assert.AreEqual("mock-jwt-token", response.Token);
            Assert.AreEqual("User", response.Role);
            Assert.AreEqual(1, response.userId);
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

            var result = await _authController.Login(loginDTO);
            var unauthorized = result as UnauthorizedObjectResult;

            Assert.IsNotNull(unauthorized);
            Assert.AreEqual(401, unauthorized.StatusCode);

            var response = JObject.FromObject(unauthorized.Value);
            Assert.AreEqual("Invalid Credentials", response["message"]?.ToString());
        }


    }
}
