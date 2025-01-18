using Microsoft.AspNetCore.Identity;

namespace CropDealBackend.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string UserType { get; set; } 
        public bool IsActive { get; set; } = true;
        public ICollection<CropDetails> CropDetails { get; set; } // Navigation property for related CropDetails
        // public ICollection<CropsInCart> CropsInCart{ get; set; }
    }
}