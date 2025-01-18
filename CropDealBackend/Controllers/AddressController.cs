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
    public class AddressController: ControllerBase
    {   
        private readonly IAddress _addressRepo;
        public AddressController(IAddress addressRepo){
            _addressRepo = addressRepo;
        }

        [HttpPost("AddAddress")]
        public async Task<IActionResult> AddAddress([FromBody] AddressDto addressDto){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user."});
            }
            var addAddress = new Address{
                Country = addressDto.Country,
                State = addressDto.State,
                District = addressDto.District,
                City = addressDto.City,
                PinCode = addressDto.PinCode,
                LandMark = addressDto.LandMark,
                UserId = userId
            };
            bool isAdded = await _addressRepo.AddAddress(addAddress);
            if(isAdded){
                return Ok(new {Message= "Address added succesfully"});
            }
            return BadRequest(new {Message="Failed to add address."});
        }

        [HttpGet("GetAddress")]
        public async Task<IActionResult> GetAddress(){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user."});
            }
            var address = await _addressRepo.GetAddress(userId);
            if(address == null){
                return Ok(new object[] {});
            }
            return Ok(new {
                AddressId = address.AddressId,
                Country = address.Country,
                State = address.State,
                District = address.District,
                City = address.City,
                PinCode = address.PinCode,
                LandMark = address.LandMark
            });
        }

        [HttpPut("UpdateAddress/{addressId}")]
        public async Task<IActionResult> UpdateAddress(int addressId, [FromBody] AddressDto addressDto){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user"});
            }
            bool isUpdated = await _addressRepo.UpdateAddressDetails(addressId, addressDto);
            if(isUpdated){
                return Ok(new {Message = "Address updated successfully."});
            }
            return BadRequest(new {Message="Failed to update address details."});
        }

        [HttpDelete("DeleteAddress/{accountId}")]
        public async Task<IActionResult> DeleteAddress(int accountId){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user"});
            }
            bool isDeleted = await _addressRepo.DeleteAddress(accountId);
            if(isDeleted){
                return Ok(new {Message = "Account deleted successfully"});
            }
            return BadRequest(new {Message="Failed to delete address"});
        }
    }
}