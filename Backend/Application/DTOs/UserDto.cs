using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
   public class UserDto
{
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public string CIN { get; set; }
    public string Email { get; set; }
    public string WhatsApp { get; set; }
    public string? Role { get; set; }
    public string Toerana { get; set; }
    public string? Password { get; set; }
    public IFormFile? Photo { get; set; }
    public string? PhotoPath { get; set; }
    public string? QrCodeData { get; set; }
}
}