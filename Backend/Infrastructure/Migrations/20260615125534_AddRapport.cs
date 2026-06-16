using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRapport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rapports_Users_UserId",
                table: "Rapports");

            migrationBuilder.DropIndex(
                name: "IX_Rapports_UserId",
                table: "Rapports");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Rapports",
                newName: "ChefId");

            migrationBuilder.RenameColumn(
                name: "NomEmetteur",
                table: "Rapports",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "DateEnvoi",
                table: "Rapports",
                newName: "DateSent");

            migrationBuilder.RenameColumn(
                name: "Contenu",
                table: "Rapports",
                newName: "Region");

            migrationBuilder.RenameColumn(
                name: "CinEmetteur",
                table: "Rapports",
                newName: "Message");

            migrationBuilder.AddColumn<string>(
                name: "AdminReply",
                table: "Rapports",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ChefNom",
                table: "Rapports",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsSeen",
                table: "Rapports",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminReply",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "ChefNom",
                table: "Rapports");

            migrationBuilder.DropColumn(
                name: "IsSeen",
                table: "Rapports");

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "Rapports",
                newName: "NomEmetteur");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "Rapports",
                newName: "Contenu");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Rapports",
                newName: "CinEmetteur");

            migrationBuilder.RenameColumn(
                name: "DateSent",
                table: "Rapports",
                newName: "DateEnvoi");

            migrationBuilder.RenameColumn(
                name: "ChefId",
                table: "Rapports",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Rapports_UserId",
                table: "Rapports",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rapports_Users_UserId",
                table: "Rapports",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
