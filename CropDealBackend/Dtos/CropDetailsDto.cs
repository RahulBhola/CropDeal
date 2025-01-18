using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CropDealBackend.Dtos
{
    public class CropDetailsDto
    {
        public int CropId { get; set; }
        public string Type { get; set; }
        public string CropName { get; set; }
        public int AvailableQuantity { get; set; }
        public decimal PricePerKg { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public string ImageData { get; set; }
    }
}