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
        private readonly ILogger<TrainingResultRepository> _logger;

        public TrainingResultRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager, ILogger<TrainingResultRepository> logger)
        {
            _db = db;
            _userManager = userManager;
            _logger = logger;
        }

        //Add user training result
        public async Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(trainingResultInfo.UserId);
                var trainingEvent = await _db.Events.FirstOrDefaultAsync(x => x.Id == trainingResultInfo.EventId);

                if (user == null)
                {
                    throw new EntityNotFoundException("Пользователь не найден");
                }

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

                _db.Add(trainingResult);
                _db.SaveChanges();

                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
