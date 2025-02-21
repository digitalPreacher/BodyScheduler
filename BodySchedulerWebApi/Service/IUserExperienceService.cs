using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Service
{
    public interface IUserExperienceService
    {
        public Task CalculateUserExperienceAsync(string userId);
        public Task AddUserExperienceAsync(ApplicationUser user);
    }
}
