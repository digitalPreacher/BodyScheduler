using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Service
{
    public interface IAchievementService
    {
        public Task AddAchievementsAsync(ApplicationUser user);
        public Task UpdateAchievementsAsync(string userId, string achievemetName);
    }
}
