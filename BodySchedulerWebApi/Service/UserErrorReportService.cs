using BodySchedulerWebApi.DataTransferObjects.UserErrorReportDTOs;
using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class UserErrorReportService: IUserErrorReportService
    {
        private readonly IUserErrorReportRepository _repository;

        public UserErrorReportService(IUserErrorReportRepository repository)
        {
            _repository = repository;
        }

        public async Task AddUserErrorReportAsync(UserErrorReportDTO reportInfo)
        {
            await _repository.AddUserErrorReportAsync(reportInfo);
        }
    }
}
