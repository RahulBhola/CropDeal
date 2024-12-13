using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CropDealBackend.Models
{
    public class CropDetails
    {
        [Key]
        public int CropId{get; set;}
        [Required]
        public string Type{get; set;}
        [Required]
        public string CropName{get; set;}
        [Required]
        public int AvailableQuantity{get; set;}
        [Required]
        public decimal PricePerKg{get; set;}
        public string Description{get; set;}

        [Required]
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        [Required]
        public byte[] ImageData { get; set; }
    }
}