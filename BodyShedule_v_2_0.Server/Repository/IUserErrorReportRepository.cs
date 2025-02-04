using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface IUserErrorReportRepository
    {
        public Task<bool> UserErrorReportAsync(UserErrorReportDTO reportInfo);
    }
}
