using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _jwtKey = "SuperSecretKey12345678901234567890";

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("admin")]
        public async Task<IActionResult> LoginAdmin([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null) return Unauthorized("Utilisateur non trouvé.");

            var dbPassword = user.PasswordHash?.Trim();
            var reqPassword = request.Password?.Trim();

            bool isPasswordValid = (dbPassword == reqPassword);

            if (!isPasswordValid)
            {
                try
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, dbPassword);
                }
                catch
                {
                    isPasswordValid = false;
                }
            }

            if (!isPasswordValid) return Unauthorized("Mot de passe incorrect.");

            return Ok(new { token = GenerateToken(user), role = user.Role });
        }

        [AllowAnonymous]
        [HttpPost("scan")]
        public async Task<IActionResult> LoginScan([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.QrCodeData == request.Email);

            if (user == null) return Unauthorized("Code QR invalide.");

            return Ok(new { token = GenerateToken(user), role = user.Role });
        }

        private string GenerateToken(Core.Entities.User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}