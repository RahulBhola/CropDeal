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
        // Add a crop linked to a specific farmer (ApplicationUser)
        Task<bool> AddCrop(CropDetails cropDetails);
        Task<bool> EditCropDetails(int cropId, CropDetailsEditDto cropEditDto);
        Task<IEnumerable<CropDetails>> GetCropsByFarmer(string userId);
        Task<bool> DeleteCrop(int cropId);
        Task<IEnumerable<CropDetails>> GetAllCrops();

        // Add bank details linked to a specific farmer (ApplicationUser)
        // Task<bool> AddBankDetails(BankAccount bankAccount);
        // Task<BankAccount> GetBankAccountDetails(string userId);
        // Task<bool> UpdateBankDetails(int accountId, BankAccountDto bankAccountDto);
        // Task<bool> DeleteBankAccount(int accountId);

        // Add address details linked to a specific farmer (ApplicationUser)
        // Task<bool> AddAddress(Address address);
        // Task<Address> GetAddress(string userId);
        // Task<bool> UpdateAddressDetails(int addressId, AddressDto addressDto);
        // Task<bool> DeleteAddress(int accountId);
    }
}