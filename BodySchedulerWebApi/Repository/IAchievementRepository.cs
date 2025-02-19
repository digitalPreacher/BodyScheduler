using BodySchedulerWebApi.DataTransferObjects.AchievenetsDTOs;
using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Repository
{
    public interface IAchievementRepository
    {
        public Task AddAchievementsAsync(ApplicationUser user);
        public Task UpdateAchievementsAsync(UpdateAchievementDTO updateAchievementDTO);
        public Task<List<GetAchievementsDTO>> GetAchievementsAsync(string userId);
    }
}
