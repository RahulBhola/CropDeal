using CropDealBackend.Data;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class UserRepository : GenericRepository<ApplicationUser>, IUserRepository
    {
        private readonly CropDealDbContext _context;

        public UserRepository(CropDealDbContext context) : base(context) {
            _context = context;
        }

        public async Task<ApplicationUser> GetUserByEmailAsync(string email) {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}