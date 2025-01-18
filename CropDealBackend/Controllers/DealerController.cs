using System.Security.Claims;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CropDealBackend.Controllers
{
    [Authorize(Roles = "Dealer")]
    [ApiController]
    [Route("api/[controller]")]
    public class DealerController : ControllerBase {
        private readonly IDealer _dealerRepo;

        public DealerController(IDealer dealerRepo) {
            _dealerRepo = dealerRepo;
        }

        [HttpPost("AddToCart")]
        public async Task<IActionResult> AddToCart([FromBody] CropsInCart cropincart) {
            var dealerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(dealerId)) {
                return Unauthorized(new { Message = "Invalid user." });
            }
            bool isAdded = await _dealerRepo.AddCropsToCart(cropincart.UserId, [.. cropincart.CartCrops]);
            if (isAdded) {
                return Ok(new { Message = "Crops added to cart successfully." });
            }
            return BadRequest(new { Message = "Failed to add crops to cart." });
        }

        [HttpGet("ViewCart")]
        public async Task<IActionResult> ViewCart() {
            var dealerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(dealerId)) {
                return Unauthorized(new { Message = "Invalid user." });
            }
            var cropsInCart = await _dealerRepo.GetCropsInCart(dealerId);
            return Ok(cropsInCart);
        }

        [HttpDelete("RemoveFromCart")]
        public async Task<IActionResult> RemoveFromCart([FromBody] int cropId) {
            var dealerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(dealerId)) {
                return Unauthorized(new { Message = "Invalid user." });
            }
            bool isRemoved = await _dealerRepo.RemoveCropFromCart(dealerId, cropId);

            if (isRemoved) {
                return Ok(new { Message = "Crop removed from cart successfully." });
            }
            return BadRequest(new { Message = "Failed to remove crop from cart." });
        }
    }
}
