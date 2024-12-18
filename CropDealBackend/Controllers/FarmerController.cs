
using System.Security.Claims;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CropDealBackend.Controllers
{
    [Authorize(Roles = "Farmer")]
    [ApiController]
    [Route("api/[controller]")]
    public class FarmerController: ControllerBase
    {
        private readonly IFarmer _farmerRepo;
        public FarmerController(IFarmer farmerRepo){
            _farmerRepo = farmerRepo;
        }
        
        [HttpPost("AddCrop")]
        public async Task<IActionResult> AddCrop([FromBody] CropDetailsDto cropDetailsDto){
            // Convert base64 image data to byte array
            byte[] imageData = null;
            if (!string.IsNullOrEmpty(cropDetailsDto.ImageData))
            {
                try
                {
                    imageData = Convert.FromBase64String(cropDetailsDto.ImageData);
                }
                catch (FormatException)
                {
                    return BadRequest(new { Message = "Invalid image data format." });
                }
            }

            // Map DTO to the CropDetails model
            var cropDetails = new CropDetails
            {
                Type = cropDetailsDto.Type,
                CropName = cropDetailsDto.CropName,
                AvailableQuantity = cropDetailsDto.AvailableQuantity,
                PricePerKg = cropDetailsDto.PricePerKg,
                Description = cropDetailsDto.Description,
                UserId = cropDetailsDto.UserId,
                ImageData = imageData
            };

            bool isAdded = await _farmerRepo.AddCrop(cropDetails);
            if (isAdded){
                return Ok(new { Message = "Crop details added successfully." });
            }
            return BadRequest(new { Message = "Crop details could not be added." });
        }

        [HttpGet("GetCrops")]
        public async Task<IActionResult> GetCrops(){
            // Retrieve the current user's ID from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)){
                return Unauthorized(new { Message = "Invalid user." });
            }
            var crops = await _farmerRepo.GetCropsByFarmer(userId);

            // Convert the crops to DTOs if needed
            var cropDetailsDtos = crops.Select(crop => new CropDetailsDto{
                CropId = crop.CropId,
                Type = crop.Type,
                CropName = crop.CropName,
                AvailableQuantity = crop.AvailableQuantity,
                PricePerKg = crop.PricePerKg,
                Description = crop.Description,
                UserId = crop.UserId,
                ImageData = crop.ImageData != null ? Convert.ToBase64String(crop.ImageData) : null
            });

            return Ok(cropDetailsDtos);
        }

        [HttpPut("EditCrop/{cropId}")]
        public async Task<IActionResult> EditCrop(int cropId, [FromBody] CropDetailsEditDto cropEditDto)
        {
            // Update the crop details using the repository
            bool isUpdated = await _farmerRepo.EditCropDetails(cropId, cropEditDto);
            
            if (isUpdated)
            {
                return Ok(new { Message = "Crop details updated successfully." });
            }
            return BadRequest(new { Message = "Failed to update crop details." });
        }

        [HttpDelete("DeleteCrop/{cropId}")]
        public async Task<IActionResult> DeleteCrop(int cropId){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId)){
                return Unauthorized(new {Message="Invalid user."});
            }
            var crops = await _farmerRepo.GetCropsByFarmer(userId);
            var cropToDelete = crops.FirstOrDefault(c=>c.CropId == cropId);

            if(cropToDelete == null){
                return NotFound(new {Message="Crop not found or does not belong to the user."});
            }
            bool isDeleted = await _farmerRepo.DeleteCrop(cropId);
            if(isDeleted){
                return Ok(new {Message = "Crop deleted successfully"});
            }
            return BadRequest(new {Message="Falied to delete crop."});
        }
    
        [AllowAnonymous]
        [HttpGet("GetAllCrops")]
        public async Task<IActionResult> GetAllCrops(){
            var crops = await _farmerRepo.GetAllCrops();

            var cropDetailsDtos = crops.Select(crop=>new CropDetailsDto{
                CropId = crop.CropId,
                Type = crop.Type,
                CropName = crop.CropName,
                AvailableQuantity = crop.AvailableQuantity,
                PricePerKg = crop.PricePerKg,
                Description = crop.Description,
                UserId = crop.UserId,
                ImageData = crop.ImageData != null ? Convert.ToBase64String(crop.ImageData): null
            });
            return Ok(cropDetailsDtos);
        }
    }
}                       