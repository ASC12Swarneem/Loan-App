using LoanAppBackend.DTO;
using LoanAppBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace LoanAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ICaptchaService _captchaService;

        public AuthController(IAuthService authService, ICaptchaService captchaService)
        {
            _authService = authService;
            _captchaService = captchaService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            var result = await _authService.RegisterAsync(registerDTO);

            return result switch
            {
                "User Registered Successfully!" => Ok(new { message = result }),
                _ => BadRequest(new { message = result })
            };
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.CaptchaToken))
            {
                return BadRequest(new { message = "Captcha token is required." });
            }

            var captchaValid = await _captchaService.VerifyTokenAsync(loginDto.CaptchaToken);
            if (!captchaValid) {
                return BadRequest(new { message = "Captcha validation failed." });
            }

            var token = await _authService.LoginAsync(loginDto);
            if (token == "Invalid Credentials")
            {
                return Unauthorized(new { message = token });
            }

            var user = await _authService.GetUserByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }

            var response = new LoginResponseDTO
            {
                Token = token,
                Role = user.Role,
                userId = user.Id
            };


            //    var token = await _authService.LoginAsync(loginDto);
            //    if (token == "Invalid Credentials")
            //    {
            //        return Unauthorized(new { message = token }); 
            //    }

            //    var user = await _authService.GetUserByEmailAsync(loginDto.Email);
            //    if (user == null)
            //    {
            //        return Unauthorized(new { message = "Invalid Credentials" });
            //    }

            //    var response = new LoginResponseDTO
            //    {
            //        Token = token,
            //        Role = user.Role,
            //        userId = user.Id
            //    };

            return Ok(response);
        }

    }
}
