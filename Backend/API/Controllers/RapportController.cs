using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RapportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RapportController(AppDbContext context) => _context = context;

        [HttpPost("send")]
        public async Task<IActionResult> SendRapport(Rapport rapport)
        {
            _context.Rapports.Add(rapport);
            await _context.SaveChangesAsync();
            return Ok(rapport);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rapport>>> GetAll() 
            => await _context.Rapports.OrderByDescending(r => r.DateSent).ToListAsync();

        [HttpPut("mark-seen/{id}")]
        public async Task<IActionResult> MarkAsSeen(int id)
        {
            var rapport = await _context.Rapports.FindAsync(id);
            if (rapport == null) return NotFound();
            rapport.IsSeen = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("reply/{id}")]
        public async Task<IActionResult> Reply(int id, [FromBody] string reply)
        {
            var rapport = await _context.Rapports.FindAsync(id);
            if (rapport == null) return NotFound();
            rapport.AdminReply = reply;
            await _context.SaveChangesAsync();
            return Ok(rapport);
        }
    }
}