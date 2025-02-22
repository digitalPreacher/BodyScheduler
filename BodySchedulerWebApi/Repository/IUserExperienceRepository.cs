using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Repository
{
    public interface IUserExperienceRepository
    {
        public Task IncrementUserExperienceAsync(UserExperience experience);
        public Task<UserExperience> GetUserExperienceAsync(ApplicationUser user);
        public Task AddUserExperienceAsync(ApplicationUser user);
    }
}
