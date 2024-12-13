using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CropDealBackend.Dtos;
using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IFarmer
    {
        // Add a farmer by creating an ApplicationUser
        // Task<bool> AddFarmer(ApplicationUser farmer);

        // Edit farmer details using the ApplicationUser Id
        // Task<bool> EditFarmerDetails(string userId, FarmerEditDTO edit);

        // Delete a farmer (soft delete by deactivating the account)
        // Task<bool> DeleteFarmer(string userId);

        // Add a crop linked to a specific farmer (ApplicationUser)
        Task<bool> AddCrop(CropDetails cropDetails);
        Task<bool> EditCropDetails(int cropId, CropDetailsEditDto cropEditDto);

        // Add bank details linked to a specific farmer (ApplicationUser)
        // Task<bool> AddBankDetails(BankAccount bankAccount);

        // Edit bank details using the bank account ID
        // Task<bool> EditBankDetails(int bankAccountId, BankAccount bankAccount);

        // Retrieve an invoice by its ID
        // Task<Invoice> GetReceipt(int invoiceId);

        // Edit crop details using the crop ID
        // Task<bool> EditCropDetails(int cropId, CropDetailsEditDTO cropEditDTO);

        // Retrieve crop details by farmer (user ID)
        Task<IEnumerable<CropDetails>> GetCropsByFarmer(string userId);
        Task<bool> DeleteCrop(int cropId);
        Task<IEnumerable<CropDetails>> GetAllCrops();
    }
}