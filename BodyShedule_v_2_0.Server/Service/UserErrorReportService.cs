using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;
using BodyShedule_v_2_0.Server.Repository;

namespace BodyShedule_v_2_0.Server.Service
{
    public class UserErrorReportService: IUserErrorReportService
    {
        private readonly IUserErrorReportRepository _repository;

        public UserErrorReportService(IUserErrorReportRepository repository)
        {
            _repository = repository;
        }

        public bool UserErrorReport(UserErrorReportDTO reportInfo)
        {
            return _repository.UserErrorReport(reportInfo);
        }
    }
}
