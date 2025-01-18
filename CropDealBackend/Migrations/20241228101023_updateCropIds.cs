using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CropDealBackend.Migrations
{
    /// <inheritdoc />
    public partial class updateCropIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CropId",
                table: "Invoices");

            migrationBuilder.AddColumn<string>(
                name: "CropIds",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CropIds",
                table: "Invoices");

            migrationBuilder.AddColumn<int>(
                name: "CropId",
                table: "Invoices",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
