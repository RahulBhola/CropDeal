using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace CropDealBackend.Dtos
{
    public class BankAccountDto
    {
        public int AccountId { get; set; }
        public long AccountNumber { get; set; }
        public string IFSC { get; set; }
        public string BankName { get; set; }
        public string UserId { get; set; }
    }
}