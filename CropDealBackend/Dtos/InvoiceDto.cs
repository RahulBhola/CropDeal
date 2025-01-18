using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CropDealBackend.Dtos
{
    public class InvoiceDto
    {
        public string BillingTo { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int CropId { get; set; }
        public int AccountId { get; set; }
    }
}