namespace Core.Entities
{
    public class Menage
    {
        public int Id { get; set; }
        public string Region { get; set; }
        public string District { get; set; }
        public string Commune { get; set; }
        public string Fokontany { get; set; }
        public string GpsCoordinates { get; set; }
        public DateTime DateCreation { get; set; } = DateTime.Now;
        public ICollection<Citoyen> Citoyens { get; set; }
    }
}