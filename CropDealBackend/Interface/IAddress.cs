using CropDealBackend.Dtos;
using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IAddress
    {
        Task<bool> AddAddress(Address address);
        Task<Address> GetAddress(string userId);
        Task<bool> UpdateAddressDetails(int addressId, AddressDto addressDto);
        Task<bool> DeleteAddress(int accountId);
    }
}