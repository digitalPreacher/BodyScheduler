using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.UserErrorReportDTOs;
using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Repository
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
