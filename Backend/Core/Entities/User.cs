using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nom { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Prenom { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? CIN { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? WhatsApp { get; set; }

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "User"; 

        public string? QrCodeData { get; set; }

        public string? PhotoPath { get; set; }

        public string? Toerana { get; set; }

        public int? CreatedById { get; set; }
    }
}