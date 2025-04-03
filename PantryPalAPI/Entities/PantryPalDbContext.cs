using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PantryPalAPI.Entities;

public partial class PantryPalDbContext : DbContext
{
    public PantryPalDbContext()
    {
    }

    public PantryPalDbContext(DbContextOptions<PantryPalDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<PantryItem> PantryItems { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.FavoriteId).HasName("PK__Favorite__CE74FAD584DBDCBF");

            entity.Property(e => e.RecipeName).HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Favorites__UserI__3E52440B");
        });

        modelBuilder.Entity<PantryItem>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__PantryIt__727E838BF1BF15D8");

            entity.ToTable("PantryItem");

            entity.Property(e => e.ItemName).HasMaxLength(100);
            entity.Property(e => e.UnitOfMeasure).HasMaxLength(50);

            entity.HasOne(d => d.User).WithMany(p => p.PantryItems)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PantryIte__UserI__3B75D760");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CB2CAC40C");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E494202C46").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053408208A37").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
