using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Repository
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
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var bodyMeasureList = bodyMeasureInfo.BodyMeasureSet.Select(x => new BodyMeasure
            {
                MuscleName = x.MuscleName,
                MuscleSize = x.MusclesSize,
                CreateAt = DateTimeOffset.UtcNow,
                DateToLineChart = DateTimeOffset.UtcNow.ToString("yyyy/MM/dd"),
                User = user
            })
            .Where(x => x.MuscleName != string.Empty && x.MuscleSize > 0)
            .ToList();

            _db.AddRange(bodyMeasureList);
            _db.SaveChanges();

            return true;
        }

        //get unique body measure entries   
        public async Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

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
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var bodyMeasuresToLineChartData = _db.BodyMeasureSet
                .Where(x => x.User.Id == user.Id)
                .GroupBy(x => x.MuscleName)
                .Select(x => new GetBodyMeasuresToLineChartDTO
                {
                    Name = x.Key,
                    Series = _db.BodyMeasureSet.Where(k => k.MuscleName == x.Key && k.User.Id == user.Id)
                    .Select(g => new MusclesSizeToLineChartDTO
                    {
                        Value = g.MuscleSize,
                        Name = g.DateToLineChart,
                        CreateAt = g.CreateAt
                    })
                    .GroupBy(x => x.Name)
                    .Select(x => x.OrderByDescending(x => x.CreateAt).First())
                    .ToList()

                })
                .ToList();

            return bodyMeasuresToLineChartData;
        }
    }

}
