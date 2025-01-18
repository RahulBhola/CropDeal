using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CropDealBackend.Dtos
{
    public class AddressDto
    {
        public int AddressId { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public int PinCode { get; set; }
        public string LandMark { get; set; }
        public string UserId { get; set; }
    }
}