using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Stripe;

namespace CropDealBackend.Interface
{
    public interface IStripePaymentService
    {
        Task<string> CreatePaymentIntentAsync(decimal amount);
        Task<List<Product>> GetProductsAsync();
    }
}