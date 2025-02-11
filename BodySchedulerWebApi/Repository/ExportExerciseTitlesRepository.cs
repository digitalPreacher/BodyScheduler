using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Repository
{
    public class ExportExerciseTitlesRepository : IExportExerciseTitlesRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public ExportExerciseTitlesRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        
        //get titles to exercise fields in event and training program forms
        public async Task<List<GetCustomExerciseTitleDTO>> GetExerciseTitlesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {userId} не найден");
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, UserRolesConstants.AdminRole);

            if(isAdmin)
            {
                var exerciseTitlesList = await _db.CustomExerciseSet
                  .Select(x => new GetCustomExerciseTitleDTO
                  {
                      Image = !string.IsNullOrEmpty(x.Path) ? File.ReadAllBytes(x.Path) : null,
                      Title = x.ExerciseTitle
                  })
                  .ToListAsync();

                return exerciseTitlesList;
            }
            else
            {
                var exerciseTitlesList = await _db.CustomExerciseSet
                    .Where(x => x.User.Id == user.Id || x.Type == CustomExerciseConstants.GeneralExerciseType)
                    .Select(x => new GetCustomExerciseTitleDTO
                    {
                        Image = !string.IsNullOrEmpty(x.Path) ? File.ReadAllBytes(x.Path) : null,
                        Title = x.ExerciseTitle
                    })
                    .ToListAsync(); 
                
                return exerciseTitlesList;
            }
        }
    }
}
