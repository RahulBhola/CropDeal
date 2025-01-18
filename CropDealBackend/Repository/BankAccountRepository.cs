using CropDealBackend.Data;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class BankAccountRepository: IBankAccount {
        private readonly CropDealDbContext _context;
        public BankAccountRepository(CropDealDbContext context){
            _context = context;
        }
        // Bank Details
        public async Task<bool> AddBankDetails(BankAccount bankAccount){
            await _context.BankAccounts.AddAsync(bankAccount);
            await _context.SaveChangesAsync();
            return true;
        }
   
        public async Task<BankAccount> GetBankAccountDetails(string userId){
            return await _context.BankAccounts.FirstOrDefaultAsync(b => b.UserId == userId);
        } 
        public async Task<bool> UpdateBankDetails(int accountId, BankAccountDto bankAccountDto){
            var bankAccount = await _context.BankAccounts.FirstOrDefaultAsync(b => b.AccountId == accountId);
            if (bankAccount == null) {
                return false; 
            }
            bankAccount.AccountNumber = bankAccountDto.AccountNumber;
            bankAccount.IFSC = bankAccountDto.IFSC;
            bankAccount.BankName = bankAccountDto.BankName;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBankAccount(int accountId){
            var account = await _context.BankAccounts.FirstOrDefaultAsync(a=>a.AccountId == accountId);
            if(account == null){
                return false;
            }
            _context.BankAccounts.Remove(account);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}