namespace Application.DTOs
{
    public class CitoyenDto
    {
        public int MenageId { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public DateTime DateNaissance { get; set; }
        public string CIN { get; set; }
        public string SituationMatrimoniale { get; set; }
        public int NombreEnfants { get; set; }
        public string Profession { get; set; }
        public string Sexe { get; set; }
    }
}