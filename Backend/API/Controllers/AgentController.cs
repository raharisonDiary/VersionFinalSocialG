using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize(Roles = "ChefRegional, Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AgentController : ControllerBase
    {
        private readonly IAgentService _agentService;

        public AgentController(IAgentService agentService)
        {
            _agentService = agentService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] UserDto dto)
        {
            try
            {
                var chefId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _agentService.CreateAgentAsync(dto, chefId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var chefId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _agentService.GetAgentByIdAsync(id, chefId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("qr/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetQrCode(int id)
        {
            var qrBytes = await _agentService.GetAgentQrCodeAsync(id);
            if (qrBytes == null) return NotFound();
            return File(qrBytes, "image/png");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UserDto dto)
        {
            try
            {
                var chefId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _agentService.UpdateAgentAsync(id, dto, chefId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var chefId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _agentService.GetAgentsByChefIdAsync(chefId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var chefId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _agentService.DeleteAgentAsync(id, chefId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}