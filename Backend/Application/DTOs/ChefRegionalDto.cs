using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class ChefRegionalDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Cin { get; set; } = string.Empty;
        public string Adresse { get; set; } = string.Empty;
        public string Whatsapp { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhotoPath { get; set; }
        public string? QrCodePath { get; set; }
        public IFormFile? Photo { get; set; }
    }
}