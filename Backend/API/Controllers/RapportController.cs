using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Infrastructure.Data;
using Core.Entities;
using API.DTOs; 

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RapportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RapportController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Chef")]
        public async Task<IActionResult> EnvoyerRapport(RapportDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var rapport = new Rapport
            {
                NomEmetteur = dto.Nom,
                CinEmetteur = dto.Cin,
                Contenu = dto.Contenu,
                UserId = int.Parse(userIdClaim)
            };

            _context.Rapports.Add(rapport);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Rapport envoyé avec succès" });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Rapport>>> GetRapports()
        {
            return await _context.Rapports.ToListAsync();
        }
    }
}