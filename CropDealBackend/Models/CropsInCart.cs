using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CropDealBackend.Models {
    public class CropsInCart {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        // [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }
        public int[] CartCrops{get;set;}
        // public ConcurrentDictionary<string, int>  CartCrops{get;set;}
        // public string[] BoughtCrops{get;set;}
    }
}