using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Utilities.Constants;
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

            IQueryable<CustomExercise> exerciseTitlesQuery = _db.CustomExerciseSet;

            var isAdmin = await _userManager.IsInRoleAsync(user, UserRolesConstants.AdminRole);
            //setting query condition for user
            if (!isAdmin)
            {
                exerciseTitlesQuery = exerciseTitlesQuery.Where(x => x.User.Id == user.Id || x.Type == CustomExerciseConstants.GeneralExerciseType);
            }

            var exerciseTitles = await exerciseTitlesQuery.Select(x => new
            {
                x.ExerciseTitle,
                x.Path
            })
            .ToListAsync();

            //setting and return dto
            var returnedExerciseTitles = new List<GetCustomExerciseTitleDTO>();
            foreach(var exerciseTitle in exerciseTitles)
            {
                byte[]? imageByte = null;
                if (exerciseTitle.Path != null)
                {
                    imageByte = await File.ReadAllBytesAsync(exerciseTitle.Path);
                }

                returnedExerciseTitles.Add(new GetCustomExerciseTitleDTO
                {
                    Title = exerciseTitle.ExerciseTitle,
                    Image = imageByte
                });
            }

            return returnedExerciseTitles;
        }
    }
}
