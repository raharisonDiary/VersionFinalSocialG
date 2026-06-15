using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Core.Entities;
using Application.DTOs;
using QRCoder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin,ChefRegional")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [Authorize(Roles = "Admin,ChefRegional")]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [Authorize(Roles = "Admin,ChefRegional")]
        [HttpPost("create")]
        public async Task<ActionResult<User>> CreateUser(UserDto userDto)
        {
            var user = new User
            {
                Nom = userDto.Nom,
                Prenom = userDto.Prenom,
                CIN = userDto.CIN,
                Email = userDto.Email,
                WhatsApp = userDto.WhatsApp,
                Role = userDto.Role,
                Toerana = userDto.Toerana,
                PasswordHash = userDto.Password,
                QrCodeData = Guid.NewGuid().ToString()
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [Authorize(Roles = "Admin,ChefRegional")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null) return NotFound();
    _context.Users.Remove(user);
    await _context.SaveChangesAsync();
    return NoContent();
}

        [AllowAnonymous]
        [HttpGet("generate-qr/{id}")]
        public IActionResult GenerateQrCode(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(user.QrCodeData, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
            byte[] qrCodeImage = qrCode.GetGraphic(20);

            return File(qrCodeImage, "image/png");
        }
    }
}