using System.ComponentModel.DataAnnotations;

namespace CropDealBackend.Models
{
    public class Address
    {
        [Key]
        public int AddressId { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        public string District { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public int PinCode { get; set; }

        public string LandMark { get; set; }
        
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}