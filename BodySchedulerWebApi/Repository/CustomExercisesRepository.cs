using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Xml.Serialization;
using static System.Net.Mime.MediaTypeNames;

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

        //get custom exercise by exerciseId
        public async Task<GetCustomExercisesDTO> GetCustomExerciseAsync(int exerciseId)
        {
            var currentCustomExercise = await _db.CustomExerciseSet.FirstOrDefaultAsync(x => x.Id == exerciseId);
            if (currentCustomExercise == null)
            {
                throw new EntityNotFoundException($"Упражнение с id: {exerciseId} не найдено");
            }

            var getCustomExercise = new GetCustomExercisesDTO
            {
                ExerciseId = currentCustomExercise.Id,
                ExerciseTitle = currentCustomExercise.ExerciseTitle,
                ExerciseDescription = currentCustomExercise.ExerciseDescription,
                ImageName = Path.GetFileName(currentCustomExercise.Path),
                Image = currentCustomExercise.Path != null ? await File.ReadAllBytesAsync(currentCustomExercise.Path) : null
            };

            return getCustomExercise;
        }


        //get custom exercises by userId
        public async Task<List<GetCustomExercisesDTO>> GetCustomExercisesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {userId} не найден");
            }

            IQueryable<CustomExercise> customExercisesQuery = _db.CustomExerciseSet;


            var isAdmin = await _userManager.IsInRoleAsync(user, UserRolesConstants.AdminRole);
            //setting query condition for user
            if (!isAdmin)
            {
                customExercisesQuery = customExercisesQuery.Where(x => x.User.Id == user.Id || x.Type == CustomExerciseConstants.GeneralExerciseType);
            }

            //get exercise data from db
            var exercises = await customExercisesQuery.Select(x => new
            {
                x.Id,
                x.ExerciseTitle,
                x.ExerciseDescription,
                x.Type,
                x.Path
            })
            .ToListAsync();

            //setting and return dto
            var returnedExercises = new List<GetCustomExercisesDTO>();
            foreach (var exercise in customExercisesQuery)
            {
                byte[]? imageByte = null;

                if(exercise.Path != null)
                {
                    imageByte = await File.ReadAllBytesAsync(exercise.Path);
                }

                returnedExercises.Add(new GetCustomExercisesDTO
                {
                    ExerciseId = exercise.Id,
                    ExerciseTitle = exercise.ExerciseTitle,
                    ExerciseDescription = exercise.ExerciseDescription,
                    Type = exercise.Type,
                    Image = imageByte
                });
             }

            return returnedExercises;
        }

        //add custom exercise
        public async Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo)
        {
            var user = await _userManager.FindByIdAsync(exerciseInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {exerciseInfo.UserId} не найден");
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, UserRolesConstants.AdminRole);
            var exerciseType = isAdmin ? CustomExerciseConstants.GeneralExerciseType : CustomExerciseConstants.CustomExerciseType;

            var customExercise = new CustomExercise
            {
                ExerciseTitle = exerciseInfo.ExerciseTitle,
                ExerciseDescription = exerciseInfo.ExerciseDescription,
                Type = exerciseType,
                User = user,
            };

            //added entity with an image
            if (exerciseInfo.Image != null)
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "ExerciseImages", exerciseInfo.Image.FileName);
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    exerciseInfo.Image.CopyTo(stream);
                }

                customExercise.Path = path;
            }
           
            await _db.CustomExerciseSet.AddAsync(customExercise);
            await _db.SaveChangesAsync();
        }

        //delete custom exercise by exerciseId
        public async Task DeleteCustomExerciseAsync(string userId, int exerciseId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {userId} не найден");
            }

            var customExerciseQuery = _db.CustomExerciseSet.Where(x => x.Id == exerciseId);
            if (customExerciseQuery == null)
            {
                throw new EntityNotFoundException($"Упражнение с id: {exerciseId} не найдено");
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, UserRolesConstants.AdminRole);
            if(!isAdmin)
            {
                customExerciseQuery = customExerciseQuery.Where(x => x.User.Id == user.Id);
            }

            var exerciseToDelete = await customExerciseQuery.FirstOrDefaultAsync();
            if (exerciseToDelete == null)
            {
                throw new EntityNotFoundException($"Упражнение с id: {exerciseId} не найдено");
            }

            _db.CustomExerciseSet.Remove(exerciseToDelete);
            await _db.SaveChangesAsync();
        }


        //edit custom exercise
        public async Task EditCustomExerciseAsync(EditCustomExerciseDTO exerciseInfo)
        {
            var user = await _userManager.FindByIdAsync(exerciseInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {exerciseInfo.UserId} не найден");
            }

            var currentExercise = await _db.CustomExerciseSet.FirstOrDefaultAsync(x => x.Id == exerciseInfo.ExerciseId);
            if(currentExercise == null)
            {
                throw new EntityNotFoundException($"Упражнение с id: {exerciseInfo.UserId} не найдено");
            }

            currentExercise.ExerciseTitle = exerciseInfo.ExerciseTitle;
            currentExercise.ExerciseDescription = exerciseInfo.ExerciseDescription;

            //edit entity with and without an image
            if (exerciseInfo.Image != null)
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "ExerciseImages", exerciseInfo.Image.FileName);
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    exerciseInfo.Image.CopyTo(stream);
                }

                currentExercise.Path = path;
            }
            else
            {
                currentExercise.Path = null;
            }
            
            await _db.SaveChangesAsync();
        }
    }
}
