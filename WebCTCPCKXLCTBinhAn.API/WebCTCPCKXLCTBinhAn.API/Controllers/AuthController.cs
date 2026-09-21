using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Models;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IUserRepository userRepository, IPasswordService passwordService, IJwtService jwtService) : Controller
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordService _passwordService = passwordService;
        private readonly IJwtService _jwtService = jwtService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var exists = await _userRepository.EmailExistsAsync(request.Email);
            if(exists)
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim().ToLowerInvariant(),
                PasswordHash = _passwordService.HashPassword(request.Password),
                Role = "User"
            };

            await _userRepository
           .CreateAsync(user);


            return Ok(new
            {
                message =
                    "Đăng ký thành công."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult>
    Login(LoginRequest request)
        {
            var user =
                await _userRepository
                    .GetByEmailAsync(
                        request.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message =
                        "Email hoặc mật khẩu không đúng."
                });
            }


            var validPassword =
                _passwordService
                    .VerifyPassword(
                        user.PasswordHash,
                        request.Password
                    );


            if (!validPassword)
            {
                return Unauthorized(new
                {
                    message =
                        "Email hoặc mật khẩu không đúng."
                });
            }


            var jwt =
                _jwtService
                    .GenerateToken(user);


            return Ok(new AuthResponse
            {
                AccessToken =
                    jwt.AccessToken,

                ExpiresAt =
                    jwt.ExpiresAt,

                FullName =
                    user.FullName,

                Role =
                    user.Role
            });
        }

    }
}
