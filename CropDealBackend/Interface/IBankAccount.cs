using CropDealBackend.Dtos;
using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IBankAccount
    {
        // Add bank details linked to a specific farmer (ApplicationUser)
        Task<bool> AddBankDetails(BankAccount bankAccount);
        Task<BankAccount> GetBankAccountDetails(string userId);
        Task<bool> UpdateBankDetails(int accountId, BankAccountDto bankAccountDto);
        Task<bool> DeleteBankAccount(int accountId);
    }
}