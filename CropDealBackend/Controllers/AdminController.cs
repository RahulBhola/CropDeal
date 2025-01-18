using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CropDealBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public AdminController(IAdminRepository adminRepository,UserManager<ApplicationUser> userManager ,IConfiguration configuration) {
            _adminRepository = adminRepository;
            _userManager = userManager;
            _configuration = configuration;
        }

        // Admin Login Endpoint
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> AdminLogin([FromBody] AdminLoginDto adminLoginDto) {
            var admin = await _adminRepository.GetAdminCredentialsAsync();

            if (admin == null || admin.Email != adminLoginDto.Email || admin.Password != adminLoginDto.Password) {
                return Unauthorized(new { Message = "Invalid credentials." });
            }
            // Generate JWT token for admin
            var token = GenerateJwtToken(admin);
            return Ok(new { Token = token });
        }

        // Activate or Deactivate
        [HttpPut("toggle-user-activation/{userId}")]
        public async Task<IActionResult> ToggleUserActivation(string userId, [FromBody] bool isActive){
            var user = await _userManager.FindByIdAsync(userId);
            if(user == null) {
                return NotFound(new {Message="User not found"});
            }
            user.IsActive = isActive;
            var result = await _userManager.UpdateAsync(user);

            if(!result.Succeeded){
                return BadRequest(new {Message = "Failed to update user status.", Errors = result.Errors});
            }
            return Ok(new {Message= $"User has been {(isActive ? "activated": "deactivated")} successfully."});
        }

        // Helper method to generate JWT token
        private string GenerateJwtToken(Admin admin) {
            var claims = new[] {
                new Claim(ClaimTypes.Name, admin.Email),
                new Claim(ClaimTypes.Role, "Admin")
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