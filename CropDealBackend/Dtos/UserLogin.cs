using System.ComponentModel.DataAnnotations;

namespace CropDealBackend.Dtos
{
    public class UserLogin
    {
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public required string Email { get; set; }

        [Required]
        [MinLength(6)]
        public required string Password { get; set; }

        // [Required]
        // public string Role { get; set; } 
    }
}