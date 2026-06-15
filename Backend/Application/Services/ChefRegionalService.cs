using Application.DTOs;
using Application.Interfaces;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.Versioning;
using Microsoft.AspNetCore.Hosting;

namespace Application.Services
{
    [SupportedOSPlatform("windows")]
    public class ChefRegionalService : IChefRegionalService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ChefRegionalService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<ChefRegionalDto> GetChefByIdAsync(int id)
        {
            var chef = await _context.ChefsRegionaux.FindAsync(id);
            if (chef == null) throw new Exception("Chef introuvable");

            return new ChefRegionalDto
            {
                Id = chef.Id,
                Nom = chef.Nom,
                Prenom = chef.Prenom,
                Cin = chef.Cin,
                Adresse = chef.Adresse,
                Whatsapp = chef.Whatsapp,
                Email = chef.Email,
                PhotoPath = chef.PhotoPath,
                QrCodePath = chef.QrCodePath
            };
        }

        public async Task<IEnumerable<ChefRegionalDto>> GetAllChefsAsync()
        {
            return await _context.ChefsRegionaux
                .Select(c => new ChefRegionalDto
                {
                    Id = c.Id,
                    Nom = c.Nom,
                    Prenom = c.Prenom,
                    Cin = c.Cin,
                    Adresse = c.Adresse,
                    Whatsapp = c.Whatsapp,
                    Email = c.Email,
                    PhotoPath = c.PhotoPath,
                    QrCodePath = c.QrCodePath
                }).ToListAsync();
        }

        public async Task<User> CreateChefAsync(ChefRegionalDto dto, int adminId, string role)
        {
            if (await _context.ChefsRegionaux.AnyAsync(c => c.Cin == dto.Cin))
                throw new Exception("Ce chef existe déjà");

            var chef = new ChefRegional
            {
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Cin = dto.Cin,
                Adresse = dto.Adresse,
                Whatsapp = dto.Whatsapp,
                Email = dto.Email
            };

            if (dto.Photo != null && dto.Photo.Length > 0)
            {
                string uploadFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Photo.FileName);
                string filePath = Path.Combine(uploadFolder, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Photo.CopyToAsync(fileStream);
                }
                chef.PhotoPath = "uploads/" + fileName;
            }

            _context.ChefsRegionaux.Add(chef);
            await _context.SaveChangesAsync();
            
            string uniqueQrData = Guid.NewGuid().ToString();
            chef.QrCodePath = GenerateQRCode(uniqueQrData);
            await _context.SaveChangesAsync();

            var user = new User
            {
                Nom = chef.Nom,
                Prenom = chef.Prenom,
                Email = chef.Email,
                Role = role,
                PasswordHash = "DEFAULT_PASSWORD_FOR_SCAN",
                QrCodeData = uniqueQrData,
                CreatedById = adminId
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task UpdateChefAsync(int id, ChefRegionalDto dto)
        {
            var chef = await _context.ChefsRegionaux.FindAsync(id);
            if (chef == null) throw new Exception("Chef introuvable");

            chef.Nom = dto.Nom;
            chef.Prenom = dto.Prenom;
            chef.Cin = dto.Cin;
            chef.Adresse = dto.Adresse;
            chef.Whatsapp = dto.Whatsapp;
            chef.Email = dto.Email;

            if (dto.Photo != null && dto.Photo.Length > 0)
            {
                string uploadFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Photo.FileName);
                string filePath = Path.Combine(uploadFolder, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Photo.CopyToAsync(fileStream);
                }
                chef.PhotoPath = "uploads/" + fileName;
            }

            _context.ChefsRegionaux.Update(chef);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteChefAsync(int id)
        {
            var chef = await _context.ChefsRegionaux.FindAsync(id);
            if (chef != null)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == chef.Email);
                if (user != null) _context.Users.Remove(user);
                
                _context.ChefsRegionaux.Remove(chef);
                await _context.SaveChangesAsync();
            }
        }

        private string GenerateQRCode(string data)
        {
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            using (QRCodeData qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q))
            using (QRCode qrCode = new QRCode(qrCodeData))
            using (Bitmap qrCodeImage = qrCode.GetGraphic(20))
            {
                string folderPath = Path.Combine(_env.WebRootPath, "qrcodes");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                string fileName = $"qr_{Guid.NewGuid()}.png";
                string filePath = Path.Combine(folderPath, fileName);
                qrCodeImage.Save(filePath, ImageFormat.Png);
                return "qrcodes/" + fileName;
            }
        }
    }
}