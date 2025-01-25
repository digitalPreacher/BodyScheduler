using BodyShedule_v_2_0.Server.DataTransferObjects.AdminUserDTOs;
using BodyShedule_v_2_0.Server.Models;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface IAdminUserService
    {
        public Task<List<GetApplicationUsersDTO>> GetApplicationUsersAsync();
    }
}
