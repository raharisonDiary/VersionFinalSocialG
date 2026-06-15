using Application.DTOs;
using Application.Interfaces;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using QRCoder;
using Microsoft.AspNetCore.Hosting;

namespace Application.Services
{
    public class AgentService : IAgentService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AgentService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string GenerateQrCodeBase64(string text)
        {
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            using (QRCodeData qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q))
            using (PngByteQRCode qrCode = new PngByteQRCode(qrCodeData))
            {
                return Convert.ToBase64String(qrCode.GetGraphic(20));
            }
        }

        public async Task<User> CreateAgentAsync(UserDto dto, int chefId)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Cet email est déjà utilisé.");

            string? savedPhotoPath = null;
            if (dto.Photo != null)
            {
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Photo.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Photo.CopyToAsync(stream);
                }
                savedPhotoPath = "uploads/" + fileName;
            }

            var agent = new User
            {
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Email = dto.Email,
                CIN = dto.CIN,
                WhatsApp = dto.WhatsApp,
                Toerana = dto.Toerana,
                Role = "Agent",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedById = chefId,
                PhotoPath = savedPhotoPath,
                QrCodeData = GenerateQrCodeBase64(dto.Email)
            };

            _context.Users.Add(agent);
            await _context.SaveChangesAsync();
            return agent;
        }

        public async Task<UserDto?> GetAgentByIdAsync(int id, int chefId)
        {
            var agent = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.CreatedById == chefId);
            if (agent == null) return null;

            return new UserDto
            {
                Nom = agent.Nom,
                Prenom = agent.Prenom,
                CIN = agent.CIN,
                Email = agent.Email,
                WhatsApp = agent.WhatsApp,
                Toerana = agent.Toerana,
                Role = agent.Role,
                PhotoPath = agent.PhotoPath,
                QrCodeData = agent.QrCodeData
            };
        }

        public async Task<IEnumerable<User>> GetAgentsByChefIdAsync(int chefId)
        {
            return await _context.Users.Where(u => u.Role == "Agent" && u.CreatedById == chefId).ToListAsync();
        }

        public async Task UpdateAgentAsync(int id, UserDto dto, int chefId)
        {
            var agent = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.CreatedById == chefId);
            if (agent != null)
            {
                agent.Nom = dto.Nom;
                agent.Prenom = dto.Prenom;
                agent.Email = dto.Email;
                agent.CIN = dto.CIN;
                agent.WhatsApp = dto.WhatsApp;
                agent.Toerana = dto.Toerana;

                if (dto.Photo != null)
                {
                    var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Photo.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.Photo.CopyToAsync(stream);
                    }
                    agent.PhotoPath = "uploads/" + fileName;
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAgentAsync(int id, int chefId)
        {
            var agent = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.CreatedById == chefId);
            if (agent != null)
            {
                _context.Users.Remove(agent);
                await _context.SaveChangesAsync();
            }
        }
    }
}