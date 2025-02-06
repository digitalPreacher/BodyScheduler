using BodySchedulerWebApi.DataTransferObjects.UserErrorReportDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface IUserErrorReportService
    {
        public Task AddUserErrorReportAsync(UserErrorReportDTO reportInfo);
    }
}
