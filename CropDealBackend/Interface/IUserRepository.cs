using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IUserRepository : IGenericRepository<ApplicationUser>
    {
        Task<ApplicationUser> GetUserByEmailAsync(string email);
    }
}