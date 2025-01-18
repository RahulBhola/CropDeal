using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CropDealBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToCropDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "CropDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "CropDetails");
        }
    }
}
