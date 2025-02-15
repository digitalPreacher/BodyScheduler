using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Repository
{
    public interface IAchievementRepository
    {
        public Task AddAchivementsAsync(ApplicationUser user);
    }
}
