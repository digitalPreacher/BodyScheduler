using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.AchievenetsDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Utilities.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Repository
{
    public class AchievementRepository : IAchievementRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public AchievementRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        //add user achievements
        public async Task AddAchievementsAsync(ApplicationUser user)
        {
            var achievementTypes = await _db.AchievementTypeSet.ToArrayAsync();
            var achievement = new Achievement[achievementTypes.Length];
            for (int i = 0; i < achievementTypes.Length; i++)
            {
                achievement[i] = new Achievement { CurrentCountValue = (int)AchievementValues.InitialValue, CreateAt = DateTime.Now, ModTime = DateTime.Now, Type = achievementTypes[i], User = user };

                switch (achievementTypes[i].Name)
                {
                    case AchievementTypeNameConstants.Beginner:
                        achievement[i].PurposeValue = (int)AchievementValues.BeginnerPurposeValue;
                        break;
                    case AchievementTypeNameConstants.Young:
                        achievement[i].PurposeValue = (int)AchievementValues.YoungPurposeValue;
                        break;
                    case AchievementTypeNameConstants.Сontinuing:
                        achievement[i].PurposeValue = (int)AchievementValues.СontinuingPurposeValue;
                        break;
                    case AchievementTypeNameConstants.Athlete:
                        achievement[i].PurposeValue = (int)AchievementValues.AthletePurposeValue;
                        break;
                    case AchievementTypeNameConstants.Universe:
                        achievement[i].PurposeValue = (int)AchievementValues.UniversePurposeValue;
                        break;
                    case AchievementTypeNameConstants.Started:
                        achievement[i].PurposeValue = (int)AchievementValues.StartedPurposeValue;
                        break;
                }
            }

            await _db.AddRangeAsync(achievement);
            await _db.SaveChangesAsync();
        }

        //update user achievements
        public async Task UpdateAchievementsAsync(UpdateAchievementDTO updateAchievementDTO)
        {
            var user = await _userManager.FindByIdAsync(updateAchievementDTO.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{updateAchievementDTO.UserId} не найден");
            }

            
            foreach(var achievementName in updateAchievementDTO.AchievemetNames)
            {
                var achievementType = await _db.AchievementTypeSet.FirstOrDefaultAsync(x => x.Name == achievementName);
                if (achievementType == null)
                {
                    throw new EntityNotFoundException($"Достижение с названием:{achievementName} не найдено");
                }

                var achivement = await _db.AchievementSet.FirstOrDefaultAsync(x => x.User == user && x.Type == achievementType);
                if (achivement == null)
                {
                    throw new EntityNotFoundException($"У пользователя отсутствует достижение с названием:{achievementName}");
                }

                if (!achivement.IsCompleted)
                {
                    if (achivement.CurrentCountValue < achivement.PurposeValue)
                    {
                        achivement.CurrentCountValue += 1;
                        achivement.ModTime = DateTime.Now;
                    }

                    if (achivement.CurrentCountValue == achivement.PurposeValue)
                    { 
                        achivement.IsCompleted = true;
                        achivement.ModTime = DateTime.Now;
                    }
                }   
            }

            await _db.SaveChangesAsync();

        }

        //return user achievement list
        public async Task<List<GetAchievementsDTO>> GetAchievementsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{userId} не найден");
            }

            IQueryable<Achievement> userAchievements =_db.AchievementSet.Where(x => x.User == user);

            var returnedAchievements = await userAchievements.Select(x => new GetAchievementsDTO
            {
                Id = x.Id,
                CurrentCountValue = x.CurrentCountValue,
                IsCompleted = x.IsCompleted,
                PurposeValue = x.PurposeValue,
                Name = x.Type.Name,
                Description = x.Type.Description,
            })
            .ToListAsync();

            return returnedAchievements;
        }

        enum AchievementValues
        {
            InitialValue = 0,
            BeginnerPurposeValue = 1,
            YoungPurposeValue = 10,
            СontinuingPurposeValue = 50,
            AthletePurposeValue = 100,
            UniversePurposeValue = 500,
            StartedPurposeValue = 1
        }
    }
}
