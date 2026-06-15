using System;

namespace Core.Entities
{
    public class Rapport
    {
        public int Id { get; set; }
        public string NomEmetteur { get; set; } = string.Empty;
        public string CinEmetteur { get; set; } = string.Empty;
        public string Contenu { get; set; } = string.Empty;
        public DateTime DateEnvoi { get; set; } = DateTime.Now;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}