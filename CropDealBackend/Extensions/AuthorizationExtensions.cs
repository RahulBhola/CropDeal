using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CropDealBackend.Extensions
{
    public static class AuthorizationExtensions
    {
        public static IServiceCollection AddAuthorizationServices(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("DealerOnly", policy => policy.RequireRole("Dealer"));
                options.AddPolicy("FarmerOnly", policy => policy.RequireRole("Farmer"));
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            });

            return services;
        }
    }
}