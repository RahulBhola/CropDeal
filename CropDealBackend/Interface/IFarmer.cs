using CropDealBackend.Dtos;
using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IFarmer
    {
        // Add a crop linked to a specific farmer (ApplicationUser)
        Task<bool> AddCrop(CropDetails cropDetails);
        Task<bool> EditCropDetails(int cropId, CropDetailsEditDto cropEditDto);
        Task<IEnumerable<CropDetails>> GetCropsByFarmer(string userId);
        Task<bool> DeleteCrop(int cropId);
        Task<IEnumerable<CropDetails>> GetAllCrops();
        Task<CropDetails> GetCropById(int cropId); 
        Task<IEnumerable<CropDetails>> GetCropDetailsByIds(int[] cropIds);
    }
}