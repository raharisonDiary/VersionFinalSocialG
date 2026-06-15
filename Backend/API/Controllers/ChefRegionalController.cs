using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class ChefRegionalController : ControllerBase
    {
        private readonly IChefRegionalService _chefService;

        public ChefRegionalController(IChefRegionalService chefService)
        {
            _chefService = chefService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            return Ok(await _chefService.GetAllChefsAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) 
        {
            try {
                return Ok(await _chefService.GetChefByIdAsync(id));
            } catch {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _chefService.DeleteChefAsync(id);
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ChefRegionalDto dto)
        {
            try {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _chefService.CreateChefAsync(dto, adminId, "ChefRegional");
                return Ok(result);
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ChefRegionalDto dto)
        {
            try {
                await _chefService.UpdateChefAsync(id, dto);
                return Ok(new { message = "Mise à jour réussie" });
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
    }
}