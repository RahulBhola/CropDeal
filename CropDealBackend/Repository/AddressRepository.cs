using CropDealBackend.Data;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class AddressRepository: IAddress
    {
        private readonly CropDealDbContext _context;
        public AddressRepository(CropDealDbContext context){
            _context = context;
        }

        public async Task<bool> AddAddress(Address address)
        {
            var isPresent = await _context.Addresses.FirstOrDefaultAsync(a=>a.AddressId == address.AddressId);
            if(isPresent == null){
                await _context.Addresses.AddAsync(address);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<Address> GetAddress(string userId){
            return await _context.Addresses.FirstOrDefaultAsync(au=>au.UserId == userId);
        }
        public async Task<bool> UpdateAddressDetails(int addressId, AddressDto addressDto){
            var address = await _context.Addresses.FirstOrDefaultAsync(a=>a.AddressId == addressId);
            if(address == null){
                return false;
            }
            address.Country = addressDto.Country;
            address.State = addressDto.State;
            address.District = addressDto.District;
            address.City = addressDto.City;
            address.PinCode = addressDto.PinCode;
            address.LandMark = addressDto.LandMark;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAddress(int addressId){
            var account = await _context.Addresses.FirstOrDefaultAsync(a=>a.AddressId == addressId);
            if(account == null){
                return false;
            }
            _context.Addresses.Remove(account);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}