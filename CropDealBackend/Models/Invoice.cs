using System.ComponentModel.DataAnnotations;

namespace CropDealBackend.Models
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }

        [Required]
        public string BillingTo { get; set; }

        [Required]
        public string DeliveryAddress { get; set; }

        [Required]
        public DateTime OrderDate{get; set;}

        [Required]
        public DateTime DeliveryDate{get; set;}
        
        [Required]
        public int[] CropIds{get; set;}
        
        [Required]
        public int AccountId{get; set;}

        public OrderTransaction OrderTransaction { get; set; }
    }
}