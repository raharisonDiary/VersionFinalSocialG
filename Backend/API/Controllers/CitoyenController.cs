using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Data;
using Core.Entities;
using Application.DTOs;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CitoyenController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CitoyenController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCitoyen([FromForm] CitoyenDto citoyenDto, IFormFile? file)
        {
            var citoyen = new Citoyen
            {
                MenageId = citoyenDto.MenageId,
                Nom = citoyenDto.Nom,
                Prenom = citoyenDto.Prenom,
                DateNaissance = citoyenDto.DateNaissance,
                CIN = citoyenDto.CIN,
                SituationMatrimoniale = citoyenDto.SituationMatrimoniale,
                NombreEnfants = citoyenDto.NombreEnfants,
                Profession = citoyenDto.Profession,
                Sexe = citoyenDto.Sexe,
                PhotoPath = string.Empty
            };

            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                citoyen.PhotoPath = "/uploads/" + fileName;
            }

            _context.Citoyens.Add(citoyen);
            await _context.SaveChangesAsync();
            return Ok(citoyen);
        }

        [HttpGet]
        public async Task<IActionResult> GetCitoyens([FromQuery] string? search)
        {
            var query = _context.Citoyens.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c => c.Nom.Contains(search) || c.Prenom.Contains(search) || c.CIN.Contains(search));
            }

            var list = await query.Select(c => new {
                c.Id, c.Nom, c.Prenom, c.CIN, c.PhotoPath, c.MenageId
            }).ToListAsync();

            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCitoyenById(int id)
        {
            var citoyen = await _context.Citoyens.FirstOrDefaultAsync(c => c.Id == id);
            if (citoyen == null) return NotFound();
            return Ok(citoyen);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCitoyen(int id, [FromForm] CitoyenDto citoyenDto, IFormFile? file)
        {
            var citoyen = await _context.Citoyens.FindAsync(id);
            if (citoyen == null) return NotFound();

            citoyen.Nom = citoyenDto.Nom;
            citoyen.Prenom = citoyenDto.Prenom;
            citoyen.DateNaissance = citoyenDto.DateNaissance;
            citoyen.CIN = citoyenDto.CIN;
            citoyen.SituationMatrimoniale = citoyenDto.SituationMatrimoniale;
            citoyen.NombreEnfants = citoyenDto.NombreEnfants;
            citoyen.Profession = citoyenDto.Profession;
            citoyen.Sexe = citoyenDto.Sexe;

            if (file != null && file.Length > 0)
            {
                if (!string.IsNullOrEmpty(citoyen.PhotoPath))
                {
                    var oldPath = Path.Combine(_env.WebRootPath ?? "wwwroot", citoyen.PhotoPath.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
                }

                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                citoyen.PhotoPath = "/uploads/" + fileName;
            }

            await _context.SaveChangesAsync();
            return Ok(citoyen);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCitoyen(int id)
        {
            var citoyen = await _context.Citoyens.FindAsync(id);
            if (citoyen == null) return NotFound();

            if (!string.IsNullOrEmpty(citoyen.PhotoPath))
            {
                var oldPath = Path.Combine(_env.WebRootPath ?? "wwwroot", citoyen.PhotoPath.TrimStart('/'));
                if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
            }

            _context.Citoyens.Remove(citoyen);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}