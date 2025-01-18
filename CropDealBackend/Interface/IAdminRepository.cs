using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IAdminRepository
    {
        Task<Admin> GetAdminCredentialsAsync();
        Task<IEnumerable<CropDetails>> GetCropsByUserId(string userId);
        Task UpdateCrops(IEnumerable<CropDetails> crops);
    }
}