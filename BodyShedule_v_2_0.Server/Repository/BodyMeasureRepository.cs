using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;

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
                .Where(x => x.MuscleName != string.Empty)
                .ToList();

                _db.AddRange(BodyMeasureList);
                _db.SaveChanges();

                return true;
            }

            return false;

        }
    }
}
