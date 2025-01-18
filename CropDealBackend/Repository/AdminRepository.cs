
using CropDealBackend.Data;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class AdminRepository: IAdminRepository
    {
        private readonly IConfiguration _configuration;
        private readonly CropDealDbContext _context;

        public AdminRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Retrieve Admin credentials from configuration
        public async Task<Admin> GetAdminCredentialsAsync()
        {
            // Simulate fetching admin credentials
            var admin = new Admin
            {
                Email = _configuration["AdminCredentials:Email"],
                Password = _configuration["AdminCredentials:Password"]
            };

            return await Task.FromResult(admin);
        }

        public async Task<IEnumerable<CropDetails>> GetCropsByUserId(string userId) {
            return await _context.CropDetails.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task UpdateCrops(IEnumerable<CropDetails> crops) {
            _context.CropDetails.UpdateRange(crops);
            await _context.SaveChangesAsync();
        }

    }
}