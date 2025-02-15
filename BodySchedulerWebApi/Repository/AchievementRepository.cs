using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Repository
{
    public class AchievementRepository : IAchievementRepository
    {
        private readonly ApplicationDbContext _db;

        public AchievementRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAchivementsAsync(ApplicationUser user)
        {
            var achievementTypes = await _db.AchievementTypeSet.ToArrayAsync();
            var achievement = new Achievement[achievementTypes.Length];
            for (int i = 0; i < achievementTypes.Length; i++)
            {
                achievement[i] = new Achievement { CreateAt = DateTime.Now, ModTime = DateTime.Now, Type = achievementTypes[i], User = user };
            }

            await _db.AddRangeAsync(achievement);
            await _db.SaveChangesAsync();
        }
    }
}
