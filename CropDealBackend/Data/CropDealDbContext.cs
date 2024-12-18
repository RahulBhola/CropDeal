using CropDealBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Data
{
    public class CropDealDbContext: IdentityDbContext<ApplicationUser>{
        public CropDealDbContext(DbContextOptions<CropDealDbContext> options): base(options){}
        public DbSet<CropDetails> CropDetails{get; set;}
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<Address> Addresses { get; set; }
    }
}