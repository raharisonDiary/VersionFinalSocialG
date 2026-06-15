using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Data;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class StatistiqueController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatistiqueController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard-data")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? district = null)
        {
            var citoyenQuery = _context.Citoyens.Include(c => c.Menage).AsQueryable();
            var menageQuery = _context.Menages.AsQueryable();

            if (!string.IsNullOrEmpty(district))
            {
                citoyenQuery = citoyenQuery.Where(c => c.Menage.District == district);
                menageQuery = menageQuery.Where(m => m.District == district);
            }

            var totalCitoyens = await citoyenQuery.CountAsync();
            var totalMenages = await menageQuery.CountAsync();

            var parSexe = await citoyenQuery
                .GroupBy(c => c.Sexe)
                .Select(g => new { Key = g.Key, Count = g.Count() })
                .ToListAsync();

            var parAge = await citoyenQuery
                .Select(c => new 
                {
                    Sokajy = (DateTime.Now.Year - c.DateNaissance.Year) < 18 ? "Zaza" : 
                             (DateTime.Now.Year - c.DateNaissance.Year) < 60 ? "Tanora" : "Antitra"
                })
                .GroupBy(x => x.Sokajy)
                .Select(g => new { Key = g.Key, Count = g.Count() })
                .ToListAsync();

            var topDistricts = await _context.Citoyens
                .Include(c => c.Menage)
                .GroupBy(c => c.Menage.District)
                .OrderByDescending(g => g.Count())
                .Take(5)
                .Select(g => new { District = g.Key ?? "Non défini", Count = g.Count() })
                .ToListAsync();

            return Ok(new { totalCitoyens, totalMenages, parSexe, parAge, topDistricts });
        }

        [HttpGet("population-par-sexe")]
        public async Task<IActionResult> GetPopulationParSexe()
        {
            var stats = await _context.Citoyens
                .GroupBy(c => c.Sexe)
                .Select(g => new { Sexe = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(stats);
        }

        [HttpGet("population-par-district")]
        public async Task<IActionResult> GetPopulationParDistrict()
        {
            var stats = await _context.Citoyens
                .Include(c => c.Menage)
                .GroupBy(c => c.Menage.District)
                .Select(g => new { District = g.Key ?? "Non défini", Count = g.Count() })
                .ToListAsync();

            return Ok(stats);
        }

        [HttpGet("population-par-commune")]
        public async Task<IActionResult> GetPopulationParCommune()
        {
            var stats = await _context.Citoyens
                .Include(c => c.Menage)
                .GroupBy(c => c.Menage.Commune)
                .Select(g => new { Commune = g.Key ?? "Non défini", Count = g.Count() })
                .ToListAsync();

            return Ok(stats);
        }

        [HttpGet("total-menages")]
        public async Task<IActionResult> GetTotalMenages()
        {
            var count = await _context.Menages.CountAsync();
            return Ok(new { TotalMenages = count });
        }
    }
}