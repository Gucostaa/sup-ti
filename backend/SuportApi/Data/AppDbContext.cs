using Microsoft.EntityFrameworkCore;
using SuportApi.Models;

namespace SuportApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Chamado> Chamados { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Chamado>(entity =>
            {
                entity.ToTable("chamados"); 
                entity.HasKey(e => e.id);   
                
                entity.Property(e => e.solucao).HasColumnName("solucao");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}