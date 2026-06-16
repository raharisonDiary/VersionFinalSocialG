using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Core.Entities;
using Application.DTOs;
using QRCoder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IO;

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

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<User>> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();
            return Ok(user);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(User updatedUser)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            user.Nom = updatedUser.Nom;
            user.Prenom = updatedUser.Prenom;
            user.CIN = updatedUser.CIN;
            user.Email = updatedUser.Email;
            user.WhatsApp = updatedUser.WhatsApp;
            user.Toerana = updatedUser.Toerana;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [Authorize]
        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            if (file == null || file.Length == 0) return BadRequest("No file uploaded");

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine("wwwroot", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.PhotoPath = fileName;
            await _context.SaveChangesAsync();
            return Ok(new { photoPath = fileName });
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