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
    public class MenageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Menage>> CreateMenage(MenageDto menageDto)
        {
            var menage = new Menage
            {
                Region = menageDto.Region,
                District = menageDto.District,
                Commune = menageDto.Commune,
                Fokontany = menageDto.Fokontany,
                GpsCoordinates = menageDto.GpsCoordinates
            };

            _context.Menages.Add(menage);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMenageById), new { id = menage.Id }, menage);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Menage>>> GetMenages()
        {
            return await _context.Menages.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Menage>> GetMenageById(int id)
        {
            var menage = await _context.Menages.FindAsync(id);

            if (menage == null)
            {
                return NotFound();
            }

            return Ok(menage);
        }

        [HttpPost("update/{id}")]
public async Task<IActionResult> UpdateMenage(int id, MenageDto menageDto)
{
    var menage = await _context.Menages.FindAsync(id);
    if (menage == null) return NotFound();

    menage.Region = menageDto.Region;
    menage.District = menageDto.District;
    menage.Commune = menageDto.Commune;
    menage.Fokontany = menageDto.Fokontany;
    menage.GpsCoordinates = menageDto.GpsCoordinates;

    await _context.SaveChangesAsync();
    return NoContent();
}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenage(int id)
        {
            var menage = await _context.Menages.FindAsync(id);
            if (menage == null)
            {
                return NotFound();
            }

            _context.Menages.Remove(menage);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}