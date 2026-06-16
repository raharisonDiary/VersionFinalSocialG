using System;

namespace Core.Entities
{
    public class Rapport
    {
        public int Id { get; set; }
        public int ChefId { get; set; }
        public string ChefNom { get; set; }
        public string ChefPrenom { get; set; }
        public string ChefCin { get; set; }
        public string Region { get; set; }
        public int NombreAgents { get; set; }
        public string Districts { get; set; }
        public string Communes { get; set; }
        public string Fokontany { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public bool IsSeen { get; set; } = false;
        public string? AdminReply { get; set; }
        public DateTime DateSent { get; set; } = DateTime.Now;
    }
}