using CropDealBackend.Dtos;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CropDealBackend.Interface;
using CropDealBackend.Filters;
using Microsoft.AspNetCore.Authorization;

namespace CropDealBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController: ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public UserController(IUserRepository userRepository, UserManager<ApplicationUser> userManager,  SignInManager<ApplicationUser> signInManager, IConfiguration configuration){
            _userRepository = userRepository;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // Register user
        [AllowAnonymous] // No authentication required for registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegister userRegisterDto)
        {
            var user = new ApplicationUser
            {
                UserName = userRegisterDto.UserName,
                Email = userRegisterDto.Email,
                IsActive = true,
                UserType = userRegisterDto.Role
            };

            var result = await _userManager.CreateAsync(user, userRegisterDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Assign the role (Dealer, Farmer, or Admin) to the user
            await _userManager.AddToRoleAsync(user, userRegisterDto.Role);
            return Ok(new { Message = "User registered successfully." });
        }

        // Login user and generate JWT Token
        [AllowAnonymous] // No authentication required for login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin userLoginDto) {
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
            if (user == null) {
                return Unauthorized(new { Message = "Invalid credentials." });
            }
            var result = await _signInManager.PasswordSignInAsync(user, userLoginDto.Password, false, false);
            if (!result.Succeeded) {
                return Unauthorized(new { Message = "Invalid credentials." });
            }
            // Get the user's roles
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(userLoginDto.Role))
            {
                return Unauthorized(new { Message = $"Access denied for role: {userLoginDto.Role}." });
            }
            // Generate JWT token
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, Role = userLoginDto.Role });
        }

        // Get user by email using the repository
        [HttpGet("get-user/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email) {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null) {
                return NotFound(new { Message = "User not found." });
            }
            return Ok(user);
        }

        // Only accessible by Admin role
        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnly(){
            return Ok("This is accessible by Admin only.");
        }

        // Only accessible by Dealer role
        [Authorize(Roles = "Dealer")]
        [HttpGet("dealer-only")]
        public IActionResult DealerOnly() {
            return Ok("This is accessible by Dealer only.");
        }

        // Only accessible by Farmer role
        [Authorize(Roles = "Farmer")]
        [HttpGet("farmer-only")]
        public IActionResult FarmerOnly() {
            return Ok("This is accessible by Farmer only.");
        }

        // Accessible by Admin or Dealer roles
        [ServiceFilter(typeof(CustomAuthorizationFilter))]
        [Authorize(Roles = "Admin,Dealer")]
        [HttpGet("admin-dealer")]
        public IActionResult AdminOrDealerOnly() {
            return Ok("This is accessible by Admin or Dealer only.");
        }

        // Accessible by any authenticated user
        [Authorize]
        [HttpGet("authenticated-only")]
        public IActionResult AuthenticatedOnly() {
            return Ok("This is accessible by authenticated users.");
        }

        // Helper method to generate JWT token
        private string GenerateJwtToken(ApplicationUser user) {
            var claims = new[] {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id ?? ""),
                new Claim(ClaimTypes.Role, _userManager.GetRolesAsync(user).Result.FirstOrDefault())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}