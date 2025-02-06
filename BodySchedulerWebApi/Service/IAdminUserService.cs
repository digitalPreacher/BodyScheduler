using BodySchedulerWebApi.DataTransferObjects.AdminUserDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface IAdminUserService
    {
        public Task<List<GetApplicationUsersDTO>> GetApplicationUsersAsync();
        public Task<GetApplicationUsersDTO> GetApplicationUserAsync(int id);
        public Task<bool> UpdateUserDataAsync(UpdateUserDataDTO updateUserInfo);
    }
}
