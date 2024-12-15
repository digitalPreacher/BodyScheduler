using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.BodyMeasureDTOs;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class BodyMeasureRepository : IBodyMeasureRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public BodyMeasureRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        //add new body measure entry
        public async Task<bool> AddBodyMeasureAsync(AddBodyMeasureDTO bodyMeasureInfo)
        {
            var user = await _userManager.FindByIdAsync(bodyMeasureInfo.UserId);
            if(user != null)
            {
                var BodyMeasureList = bodyMeasureInfo.BodyMeasureSet.Select(x => new BodyMeasure
                {
                    MuscleName = x.MuscleName,
                    MuscleSize = x.MusclesSize,
                    CreateAt = DateTime.Now,
                    User = user
                })
                .Where(x => x.MuscleName != string.Empty && x.MuscleSize > 0)
                .ToList();

                _db.AddRange(BodyMeasureList);
                _db.SaveChanges();

                return true;
            }

            return false;

        }

        //get unique body measure entries   
        public async Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            var bodyMeasures = await _db.BodyMeasureSet
                .Where(x => x.User.Id == int.Parse(userId))
                .Select(x => new GetUniqueBodyMeasureDTO
                {
                    MuscleName = x.MuscleName,
                    MusclesSize = x.MuscleSize,
                    CreateAt = x.CreateAt
                })
                .GroupBy(x => x.MuscleName )
                .Select(x => x.OrderByDescending(j => j.CreateAt).First())
                .ToListAsync();

            return bodyMeasures;
        }

        //get body measure entries for line chart
        public async Task<List<GetBodyMeasuresToLineChartDTO>> GetBodyMeasuresToLineChartAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            var bodyMeasuresToLineChartData = _db.BodyMeasureSet.
                Where(x => x.User.Id == user.Id)
                .Select(x => new GetBodyMeasuresToLineChartDTO
                {
                    Name = x.MuscleName,
                    Series = _db.BodyMeasureSet.Where(k => k.MuscleName == x.MuscleName).Select(j => new MusclesSizeToLineChartDTO
                    {
                        Value = j.MuscleSize,
                        Name = j.CreateAt.ToString("yyyy/MM/dd")
                    })
                    .ToArray()
                })
                .ToList();

            return bodyMeasuresToLineChartData;
        }
    }
}
