using BodyShedule_v_2_0.Server.DataTransferObjects.AdminUserDTOs;
using BodyShedule_v_2_0.Server.Models;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface IAdminUserRepository
    {
        public Task<List<GetApplicationUsersDTO>> GetApplicationUsersAsync();
    }
}
