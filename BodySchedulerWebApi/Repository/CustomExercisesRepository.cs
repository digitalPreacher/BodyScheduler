using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using Microsoft.AspNetCore.Identity;
using System.IO;

namespace BodySchedulerWebApi.Repository
{
    public class CustomExercisesRepository : ICustomExercisesRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public CustomExercisesRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public async Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo)
        {
            var user = await _userManager.FindByIdAsync(exerciseInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {exerciseInfo.UserId} не найден");
            }

            if(exerciseInfo.Image != null)
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "ExerciseImages", exerciseInfo.Image.FileName);
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    exerciseInfo.Image.CopyTo(stream);
                }
                var customExercise = new CustomExercise
                {
                    ExerciseTitle = exerciseInfo.ExerciseTitle,
                    ExerciseDescription = exerciseInfo.ExerciseDescription,
                    Path = path,
                    User = user,
                };

                await _db.CustomExerciseSet.AddAsync(customExercise);
                await _db.SaveChangesAsync();
            }
            else
            {
                var customExercise = new CustomExercise
                {
                    ExerciseTitle = exerciseInfo.ExerciseTitle,
                    ExerciseDescription = exerciseInfo.ExerciseDescription,
                    User = user,
                };

                await _db.CustomExerciseSet.AddAsync(customExercise);
                await _db.SaveChangesAsync();
            }
        }
    }
}
