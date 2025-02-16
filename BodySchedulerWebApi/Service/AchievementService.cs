using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class AchievementService : IAchievementService
    {
        private readonly IAchievementRepository _repository;

        public AchievementService(IAchievementRepository repository)
        {
            _repository = repository;
        }

        public async Task AddAchievementsAsync(ApplicationUser user)
        {
            await _repository.AddAchievementsAsync(user);
        }

        public async Task UpdateAchievementsAsync(string userId, string achievemetName)
        {
            await _repository.UpdateAchievementsAsync(userId, achievemetName);
        }
    }
}
