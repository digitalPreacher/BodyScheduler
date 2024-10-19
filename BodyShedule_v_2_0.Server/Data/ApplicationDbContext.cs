using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable(name: "Users");
            });
            builder.Entity<IdentityRole<int>>(entity =>
            {
                entity.ToTable(name: "Roles");

                var admin = new IdentityRole<int>()
                {
                    Id = 1,
                    Name = "admin",
                    NormalizedName = "ADMIN"
                };

                var user = new IdentityRole<int>()
                {
                    Id = 2,
                    Name = "user",
                    NormalizedName = "USER"
                };

                entity.HasData(user, admin);

            });
            builder.Entity<IdentityUserRole<int>>(entity =>
            {
                entity.ToTable(name: "UserRoles");
            });
            builder.Entity<IdentityUserClaim<int>>(entity =>
            {
                entity.ToTable(name: "UserClaims");
            });
            builder.Entity<IdentityUserLogin<int>>(entity =>
            {
                entity.ToTable(name: "UserLogins");
            });
            builder.Entity<IdentityRoleClaim<int>>(entity =>
            {
                entity.ToTable(name: "RoleClaims");
            });
            builder.Entity<IdentityUserToken<int>>(entity =>
            {
                entity.ToTable(name: "UserTokens");
            });
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Exercise> Exercises { get; set; }

    }
}
