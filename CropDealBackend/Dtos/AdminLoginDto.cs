using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CropDealBackend.Dtos
{
    public class AdminLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}