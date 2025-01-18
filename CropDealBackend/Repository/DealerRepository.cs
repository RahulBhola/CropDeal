using CropDealBackend.Data;
using CropDealBackend.Models;
using CropDealBackend.Interface;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class DealerRepository : IDealer {
        private readonly CropDealDbContext _context;

        public DealerRepository(CropDealDbContext context) {
            _context = context;
        }

        public async Task<bool> AddCropsToCart(string dealerId, List<int> cropIds) {
            var existingCart = await _context.CropsInCart.FirstOrDefaultAsync(c => c.UserId == dealerId);

            if (existingCart == null) {
                existingCart = new CropsInCart {
                    UserId = dealerId,
                    CartCrops = cropIds.ToArray()
                };
                await _context.CropsInCart.AddAsync(existingCart);
            }
            else {
                var updatedCrops = existingCart.CartCrops.Concat(cropIds).Distinct().ToArray();
                existingCart.CartCrops = updatedCrops;
            }
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CropDetails>> GetCropsInCart(string dealerId) {
            var cart = await _context.CropsInCart
                .FirstOrDefaultAsync(c => c.UserId == dealerId);

            if (cart == null || cart.CartCrops == null || cart.CartCrops.Length == 0) {
                return new List<CropDetails>();
            }

            var cropIds = cart.CartCrops;
            return await _context.CropDetails.Where(c => cropIds.Contains(c.CropId)).ToListAsync();
        }

        public async Task<bool> RemoveCropFromCart(string dealerId, int cropId) {
            var cart = await _context.CropsInCart.FirstOrDefaultAsync(c => c.UserId == dealerId);

            if (cart == null || cart.CartCrops == null) {
                return false;
            }
            cart.CartCrops = cart.CartCrops.Where(id => id != cropId).ToArray();
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
