using BodySchedulerWebApi.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Exceptions;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class TrainingResultRepository : ITrainingResultRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public TrainingResultRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        //get training results by user id
        public async Task<List<GetTrainingResults>> GetTrainingResultsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if(user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {userId} не найден");
            }

            List<GetTrainingResults> trainingResults = await _db.TraininResultSet.Where(x => x.User.Id == user.Id)
                .OrderByDescending(x => x.CreateAt)
                .Select(x => new GetTrainingResults
                {
                    Id = x.Id,
                    AmountWeight = x.AmountWeight,
                    TrainingTime = x.TrainingTime,
                    EventId = x.Event.Id
                })
                .ToListAsync();

            return trainingResults;
        }

        //Add user training result
        public async Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo)
        {
            var user = await _userManager.FindByIdAsync(trainingResultInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var trainingEvent = await _db.Events.FirstOrDefaultAsync(x => x.Id == trainingResultInfo.EventId);
            if (trainingEvent == null)
            {
                throw new EntityNotFoundException("Тренировка не найдена");
            }

            var trainingResult = new TrainingResult
            {
                TrainingTime = trainingResultInfo.TrainingTime,
                AmountWeight = trainingResultInfo.AmountWeight,
                User = user,
                Event = trainingEvent
            };

            await _db.AddAsync(trainingResult);
            await _db.SaveChangesAsync();

            return true;
        }
    }
}
