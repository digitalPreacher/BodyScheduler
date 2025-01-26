using BodyShedule_v_2_0.Server.DataTransferObjects.AdminUserDTOs;
using BodyShedule_v_2_0.Server.Repository;

namespace BodyShedule_v_2_0.Server.Service
{
    public class AdminUserService: IAdminUserService
    {
        private readonly IAdminUserRepository _repository;

        public AdminUserService(IAdminUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<GetApplicationUsersDTO>> GetApplicationUsersAsync()
        {
            return await _repository.GetApplicationUsersAsync();
        }

        public async Task<GetApplicationUsersDTO> GetApplicationUserAsync(int id)
        {
            return await _repository.GetApplicationUserAsync(id);
        }

        public async Task<bool> UpdateUserDataAsync(UpdateUserDataDTO updateUserInfo)
        {
            return await _repository.UpdateUserDataAsync(updateUserInfo);   
        }
    }
}
