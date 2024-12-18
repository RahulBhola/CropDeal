using CropDealBackend.Data;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class FarmerRepository: IFarmer
    {
        private readonly CropDealDbContext _context;
        public FarmerRepository(CropDealDbContext context){
            _context = context;
        }

        // Crop Details
        public async Task<bool> AddCrop(CropDetails cropDetails){
            var isPresent = await _context.CropDetails.FirstOrDefaultAsync(c=>c.CropId == cropDetails.CropId);
            if(isPresent == null){
                await _context.CropDetails.AddAsync(cropDetails);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<CropDetails>> GetCropsByFarmer(string userId){
            return await _context.CropDetails.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task<bool> EditCropDetails(int cropId, CropDetailsEditDto cropEditDto){
            var crop = await _context.CropDetails.FirstOrDefaultAsync(c => c.CropId == cropId);
            if (crop == null){
                return false; // Crop not found
            }
            // Update crop details
            crop.CropName = cropEditDto.CropName;
            crop.AvailableQuantity = cropEditDto.AvailableQuantity;
            crop.PricePerKg = cropEditDto.PricePerKg;
            crop.Description = cropEditDto.Description;
            // Convert the image data if provided
            if (!string.IsNullOrEmpty(cropEditDto.ImageData)){
                try{
                    crop.ImageData = Convert.FromBase64String(cropEditDto.ImageData);
                }
                catch (FormatException){
                    return false; // Invalid image format
                }
            }
            // Save changes
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCrop(int cropId){
            var crop = await _context.CropDetails.FirstOrDefaultAsync(c=>c.CropId == cropId);
            if(crop == null){
                return false;
            }
            _context.CropDetails.Remove(crop);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CropDetails>> GetAllCrops(){
            return await _context.CropDetails.Include(c=>c.User).ToListAsync();
        }    
    }
}