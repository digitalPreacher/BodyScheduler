using BodySchedulerWebApi.DataTransferObjects.AchievenetsDTOs;
using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Service
{
    public interface IAchievementService
    {
        public Task AddAchievementsAsync(ApplicationUser user);
        public Task UpdateAchievementsAsync(UpdateAchievementDTO updateAchievementDTO);
        public Task<List<GetAchievementsDTO>> GetAchievementsAsync(string userId);
    }
}
