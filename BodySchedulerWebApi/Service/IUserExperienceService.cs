using BodySchedulerWebApi.DataTransferObjects.UserExperienceDTOs;
using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Service
{
    public interface IUserExperienceService
    {
        public Task CalculateUserExperienceAsync(string userId);
        public Task<GetUserExperienceDTO> GetUserExperienceAsync(string userId);
        public Task AddUserExperienceAsync(ApplicationUser user);
    }
}
