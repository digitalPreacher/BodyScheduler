using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Utilities;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class UserErrorReportRepository: IUserErrorReportRepository
    {
        private readonly ApplicationDbContext _db;

        public UserErrorReportRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public bool UserErrorReport(UserErrorReportDTO reportInfo)
        {

            var result = EmailSender.SendEmailUserFeedback(reportInfo.Email, reportInfo.Description);
            if (result)
            {
                var userErrorReportData = new UserErrorReport
                {
                    Email = reportInfo.Email,
                    Description = reportInfo.Description,
                    CreateAt = DateTime.Now,
                };

                _db.UserErrorReportSet.Add(userErrorReportData);

                _db.SaveChanges();
            }

            return result;
        }

    }
}
