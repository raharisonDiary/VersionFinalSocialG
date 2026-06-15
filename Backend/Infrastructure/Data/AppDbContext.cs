using Microsoft.EntityFrameworkCore;
using Core.Entities;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Menage> Menages { get; set; }
        public DbSet<Citoyen> Citoyens { get; set; }
        public DbSet<Rapport> Rapports { get; set; }
        public DbSet<ChefRegional> ChefsRegionaux { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(u => u.Email).IsRequired();
            });

            modelBuilder.Entity<ChefRegional>(entity =>
            {
                entity.ToTable("ChefsRegionaux_V3");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Nom).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Prenom).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Email).IsRequired();
            });
        }
    }
}