using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Service
{
    public interface IAchievementService
    {
        public Task AddAchivementsAsync(ApplicationUser user);
    }
}
