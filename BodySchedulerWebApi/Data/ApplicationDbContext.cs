using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Utilities.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Data
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

            builder.Entity<Event>()
               .Property(x => x.EndTime)
               .HasColumnType("timestamp without time zone");

            builder.Entity<BodyMeasure>()
                .Property(x => x.CreateAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("now()");

            builder.Entity<TrainingResult>()
                .Property(x => x.CreateAt)
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("now()");

            builder.Entity<UserErrorReport>()
                .Property(x => x.CreateAt)
                .HasColumnType("timestamp without time zone")
                .HasDefaultValueSql("now()");

            builder.Entity<CustomExercise>()
                .Property(x => x.CreateAt)
                .HasColumnType("timestamp without time zone")
                .HasDefaultValueSql("now()");

            builder.Entity<AchievementType>().HasData(
                new AchievementType { Id = 1, Name = AchievementTypeNameConstants.Beginner, Description = AchievementTypeDescriptionConstants.BeginnerDescription },
                new AchievementType { Id = 2, Name = AchievementTypeNameConstants.Young, Description = AchievementTypeDescriptionConstants.YoungDescription },
                new AchievementType { Id = 3, Name = AchievementTypeNameConstants.Сontinuing, Description = AchievementTypeDescriptionConstants.СontinuingDescription },
                new AchievementType { Id = 4, Name = AchievementTypeNameConstants.Athlete, Description = AchievementTypeDescriptionConstants.AthleteDescription },
                new AchievementType { Id = 5, Name = AchievementTypeNameConstants.Universe, Description = AchievementTypeDescriptionConstants.UniverseDescription },
                new AchievementType { Id = 6, Name = AchievementTypeNameConstants.Started, Description = AchievementTypeDescriptionConstants.StartedDescription });

            builder.Entity<Achievement>()
                .Property(x => x.CreateAt)
                .HasColumnType("timestamp without time zone")
                .HasDefaultValueSql("now()");

            builder.Entity<Achievement>()
             .Property(x => x.ModTime)
             .HasColumnType("timestamp without time zone")
             .HasDefaultValueSql("now()");
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<TrainingProgram> TrainingProgramSet { get; set; }
        public DbSet<WeeksTraining> WeeksTrainingSet { get; set; }  
        public DbSet<BodyMeasure> BodyMeasureSet { get; set; }
        public DbSet<UserErrorReport> UserErrorReportSet { get; set; }
        public DbSet<TrainingResult> TraininResultSet {  get; set; }
        public DbSet<CustomExercise> CustomExerciseSet { get; set; }
        public DbSet<AchievementType> AchievementTypeSet { get; set; }
        public DbSet<Achievement> AchievementSet { get; set; }
    }
}
