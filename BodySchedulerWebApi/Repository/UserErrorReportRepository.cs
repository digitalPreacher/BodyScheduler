using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;
using BodyShedule_v_2_0.Server.Models;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class UserErrorReportRepository: IUserErrorReportRepository
    {
        private readonly ApplicationDbContext _db;

        public UserErrorReportRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        //Add data from user error report
        public async Task AddUserErrorReportAsync(UserErrorReportDTO reportInfo)
        {
            var userErrorReportData = new UserErrorReport
            {
                Email = reportInfo.Email,
                Description = reportInfo.Description,
                CreateAt = DateTime.Now,
            };

            await _db.UserErrorReportSet.AddAsync(userErrorReportData);
            await _db.SaveChangesAsync();
        }
    }
}
