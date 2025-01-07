using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface IUserErrorReportService
    {
        public bool UserErrorReport(UserErrorReportDTO reportInfo);
    }
}
