using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace CropDealBackend.Models
{
    public class BankAccount
    {
        [Key]
        public int AccountId { get; set; }
        
        [Required]
        public long AccountNumber { get; set; }

        [Required]
        public string IFSC { get; set; }

        [Required]
        public string BankName { get; set; }

        [Required]
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }
    }
}