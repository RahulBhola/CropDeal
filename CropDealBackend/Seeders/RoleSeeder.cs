using Microsoft.AspNetCore.Identity;
using CropDealBackend.Models;

namespace CropDealBackend.Seeders
{
    public static class RoleSeeder
    {
        public static void SeedRoles(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                
                var roles = new[] { "Admin", "Dealer", "Farmer" };

                foreach (var role in roles)
                {
                    var roleExist = roleManager.RoleExistsAsync(role).Result;
                    if (!roleExist)
                    {
                        var result = roleManager.CreateAsync(new IdentityRole(role)).Result;
                        if (result.Succeeded)
                        {
                            Console.WriteLine($"Role {role} created successfully.");
                        }
                        else
                        {
                            Console.WriteLine($"Error creating role {role}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                        }
                    }
                }
            }
        }
    }
}
