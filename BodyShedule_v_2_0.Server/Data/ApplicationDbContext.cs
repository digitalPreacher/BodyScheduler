using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

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
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                };

                var user = new IdentityRole<int>()
                {
                    Id = 2,
                    Name = "User",
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

            builder.Entity<Event>()
                .Property(x => x.Status)
                .HasDefaultValue("inProgress");

            builder.Entity<BodyMeasure>()
            .Property(x => x.CreateAt)
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");


            builder.Entity<UserErrorReport>()
            .Property(x => x.CreateAt)
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("now()");
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<TrainingProgram> TrainingProgramSet { get; set; }
        public DbSet<WeeksTraining> WeeksTrainingSet { get; set; }  
        public DbSet<ExerciseTitle> ExerciseTitleSet { get; set; }
        public DbSet<BodyMeasure> BodyMeasureSet { get; set; }
        public DbSet<UserErrorReport> UserErrorReportSet { get; set; }

    }
}
