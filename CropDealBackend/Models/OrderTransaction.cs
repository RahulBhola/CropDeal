using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CropDealBackend.Models
{
    public class OrderTransaction
    {
        [Key]
        public int OrderTransactionId { get; set; }

        [Required]
        public int OrderQuantity { get; set; }

        [Required]
        public double TotalPrice { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        public DateTime DeliveryDate { get; set; }

        public bool OrderTransactionStatus { get; set; }

        [ForeignKey("Invoice")]
        public int? InvoiceId { get; set; }
        public Invoice Invoice { get; set; }

        [Required]
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}