using System.Security.Claims;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CropDealBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Farmer, Dealer")]
    public class BankAccountController: ControllerBase
    {   
        private readonly IBankAccount _bankAccountRepo;
        public BankAccountController(IBankAccount bankAccountRepo){
            _bankAccountRepo = bankAccountRepo;
        }

        [HttpPost("AddBankAccount")]
        public async Task<IActionResult> AddBankAccount([FromBody] BankAccountDto bankAccountDto){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user."});
            }
            var existingBankAccount = await _bankAccountRepo.GetBankAccountDetails(userId);
            if (existingBankAccount != null) {
                return BadRequest(new { Message = "A bank account is already linked to your profile." });
            }
            var bankAccount = new BankAccount{
                AccountNumber = bankAccountDto.AccountNumber,
                IFSC = bankAccountDto.IFSC,
                BankName = bankAccountDto.BankName,
                UserId = userId
            };
            bool isAdded = await _bankAccountRepo.AddBankDetails(bankAccount);
            if(isAdded){
                return Ok(new {Message = "Bank account added successfully."});
            }
            return BadRequest(new {Message = "Failed to add bank account"});
        }

        [HttpGet("GetBankAccountDetails")]
        public async Task<IActionResult> GetBankAccountDetails() {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;   
            if (string.IsNullOrEmpty(userId)) {
                return Unauthorized(new { Message = "Invalid user." });
            }
            var bankAccount = await _bankAccountRepo.GetBankAccountDetails(userId);  
            if (bankAccount == null) {
                // return NotFound(new { Message = "Bank account not found." });
                return Ok(new object[] { });
            }
            return Ok(new {
                AccountId = bankAccount.AccountId,
                AccountNumber = bankAccount.AccountNumber,
                IFSC = bankAccount.IFSC,
                BankName = bankAccount.BankName
            });
        }
    
        [HttpPut("UpdateBankAccount/{accountId}")]
        public async Task<IActionResult> UpdateBankAccount(int accountId, [FromBody] BankAccountDto bankAccountDto){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)){
                return Unauthorized(new { Message = "Invalid user." });
            }
            bool isUpdated = await _bankAccountRepo.UpdateBankDetails(accountId, bankAccountDto);

            if (isUpdated){
                return Ok(new { Message = "Bank account updated successfully." });
            }
            return BadRequest(new { Message = "Failed to update bank account." });
        }

        [HttpDelete("DeleteBankAccount/{accountId}")]
        public async Task<IActionResult> DeleteBankAccount(int accountId){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user"});
            }
            bool isDeleted = await _bankAccountRepo.DeleteBankAccount(accountId);
            if(isDeleted){
                return Ok(new {Message="Account deleted successfully."});
            }
            return BadRequest(new {Message="Failed to delete bank account."});
        }
    }
}