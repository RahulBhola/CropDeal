using CropDealBackend.Data;
using CropDealBackend.Extensions;
using CropDealBackend.Filters;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using CropDealBackend.Repository;
using CropDealBackend.Seeders;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Add the DbContext with SQL Server connection string.
builder.Services.AddDbContext<CropDealDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 2. Add Identity services for authentication and role-based authorization.
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<CropDealDbContext>()
    .AddDefaultTokenProviders();

// 3. Use the custom extension for JWT authentication configuration.
builder.Services.AddAuthenticationServices(builder.Configuration["JwtSettings:SecretKey"]);

// 4. Add Authorization services.
builder.Services.AddAuthorizationServices();

// 5. Add scoped services for your custom filters and repositories.
builder.Services.AddScoped<CustomAuthorizationFilter>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));  // Generic repository
builder.Services.AddScoped<IUserRepository, UserRepository>();  // Custom User repository
builder.Services.AddScoped<IFarmer, FarmerRepository>();
builder.Services.AddScoped<IBankAccount, BankAccountRepository>();
builder.Services.AddScoped<IAddress, AddressRepository>();

// 6. Add Controllers (and optional Swagger configuration for API documentation).
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerExplorer();

// builder.Services.AddSwaggerGen();

var app = builder.Build();

// 7. Seed roles during app startup
RoleSeeder.SeedRoles(app);

// 8. Configure the HTTP request pipeline (Swagger UI and Middleware).
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 9. Use Authentication and Authorization middleware (Ensure Authentication is added before Authorization).
app.UseAuthentication();  // Authentication middleware
app.UseAuthorization();   // Authorization middleware

// 10. Enable HTTPS redirection.
app.UseHttpsRedirection();

// used to show image on localhost
app.UseStaticFiles();

app.UseCors(policy=>policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

// 11. Map Controllers for your API endpoints.
app.MapControllers();

// 12. Run the application.
app.Run();
 