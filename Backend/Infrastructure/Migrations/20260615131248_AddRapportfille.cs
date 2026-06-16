using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRapportfille : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChefCin",
                table: "Rapports",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ChefPrenom",
                table: "Rapports",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Communes",
                table: "Rapports",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Districts",
                table: "Rapports",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Fokontany",
                table: "Rapports",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "NombreAgents",
                table: "Rapports",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChefCin",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "ChefPrenom",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "Communes",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "Districts",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "Fokontany",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "NombreAgents",
                table: "Rapports");
        }
    }
}
