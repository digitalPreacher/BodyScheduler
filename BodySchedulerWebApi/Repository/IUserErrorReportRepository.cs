using BodySchedulerWebApi.DataTransferObjects.UserErrorReportDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface IUserErrorReportRepository
    {
        public Task AddUserErrorReportAsync(UserErrorReportDTO reportInfo);
    }
}
