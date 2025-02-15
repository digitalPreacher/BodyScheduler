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

        public async Task AddAchivementsAsync(ApplicationUser user)
        {
            await _repository.AddAchivementsAsync(user);
        }
    }
}
