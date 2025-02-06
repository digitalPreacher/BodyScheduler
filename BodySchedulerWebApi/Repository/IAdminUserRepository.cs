using BodySchedulerWebApi.DataTransferObjects.AdminUserDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface IAdminUserRepository
    {
        public Task<List<GetApplicationUsersDTO>> GetApplicationUsersAsync();
        public Task<GetApplicationUsersDTO> GetApplicationUserAsync(int id);
        public Task<bool> UpdateUserDataAsync(UpdateUserDataDTO updateUserInfo);
    }
}
