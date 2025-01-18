using System.Collections.Generic;
using System.Threading.Tasks;
using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IDealer
    {
        Task<bool> AddCropsToCart(string dealerId, List<int> cropIds);
        Task<List<CropDetails>> GetCropsInCart(string dealerId);
        Task<bool> RemoveCropFromCart(string dealerId, int cropId);
    }
}