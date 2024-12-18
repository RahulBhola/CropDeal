using CropDealBackend.Data;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CropDealBackend.Repository
{
    public class UserRepository : GenericRepository<ApplicationUser>, IUserRepository
    {
        private readonly CropDealDbContext _context;

        public UserRepository(CropDealDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<ApplicationUser> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}