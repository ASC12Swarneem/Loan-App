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

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
            var token = await _authService.LoginAsync(loginDto);

            if (token == "Invalid Credentials")
                return Unauthorized(new { message = "Invalid Credentials" });

            var user = await _authService.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid Credentials" }); // fallback if user is null

            return Ok(new LoginResponseDTO
            {
                Token = token,
                Role = user.Role,
                userId = user.Id
            });
        }
    }
}


//using LoanAppBackend.DTO;
//using LoanAppBackend.Services;
//using Microsoft.AspNetCore.Mvc;

//namespace LoanAppBackend.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly IAuthService _authService;

//        public AuthController(IAuthService authService)
//        {
//            _authService = authService;
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
//        {
//            var result = await _authService.RegisterAsync(registerDTO);
//            if (result == "User Registered Successfully!")
//                return Ok(new { message = result });

//            return BadRequest(new { message = result });
//        }

//        //[HttpPost("login")]
//        //public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
//        //{
//        //    var token = await _authService.LoginAsync(loginDto);
//        //    if (token == "Invalid Credentials")
//        //    {
//        //        return Unauthorized(new { message = token }); // Unauthorized response with error message
//        //    }

//        //    var user = await _authService.GetUserByEmailAsync(loginDto.Email);

//        //    // Use LoginResponseDTO here to return token and role
//        //    var response = new LoginResponseDTO
//        //    {
//        //        Token = token,
//        //        Role = user.Role,
//        //        userId = user.Id
//        //    };

//        //    return Ok(response); // Returning structured LoginResponseDTO
//        //}

//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
//        {
//            var token = await _authService.LoginAsync(loginDto);
//            if (token == "Invalid Credentials")
//            {
//                return Unauthorized(new { message = token }); // Unauthorized response with error message
//            }

//            var user = await _authService.GetUserByEmailAsync(loginDto.Email);
//            if (user == null)
//            {
//                return Unauthorized(new { message = "Invalid Credentials" }); // Safety check
//            }

//            var response = new LoginResponseDTO
//            {
//                Token = token,
//                Role = user.Role,
//                userId = user.Id
//            };

//            return Ok(response);
//        }

//    }
//}
