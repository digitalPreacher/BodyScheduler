using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

            var isUser = await _userManager.IsInRoleAsync(user, UserRolesConstants.UserRole);

            if (!isUser)
            {
                var exercisesLits = await _db.CustomExerciseSet
                    .Select(x => new GetCustomExercisesDTO
                    {
                        ExerciseId = x.Id,
                        ExerciseTitle = x.ExerciseTitle,
                        ExerciseDescription = x.ExerciseDescription,
                        Type = x.Type,
                        Image = x.Path != null ? File.ReadAllBytes(x.Path) : null
                    })
                    .ToListAsync();

                return exercisesLits;
            }
            else
            {
                var exercisesLits = await _db.CustomExerciseSet
                    .Where(x => x.User.Id == user.Id || x.Type == CustomExerciseConstants.GeneralExerciseType)
                    .Select(x => new GetCustomExercisesDTO
                    {
                        ExerciseId = x.Id,
                        ExerciseTitle = x.ExerciseTitle,
                        ExerciseDescription = x.ExerciseDescription,
                        Type = x.Type,
                        Image = x.Path != null ? File.ReadAllBytes(x.Path) : null
                    })
                    .ToListAsync();

                return exercisesLits;
            }
        }

        //add custom exercise
        public async Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo)
        {
            var user = await _userManager.FindByIdAsync(exerciseInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {exerciseInfo.UserId} не найден");
            }

            var isUser = await _userManager.IsInRoleAsync(user, UserRolesConstants.UserRole);
            var exerciseType = isUser ? CustomExerciseConstants.CustomExerciseType : CustomExerciseConstants.GeneralExerciseType;

            //added entity with and without an image
            if (exerciseInfo.Image != null)
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
                    Type = exerciseType,
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
                    Type = exerciseType,
                    User = user,
                };

                await _db.CustomExerciseSet.AddAsync(customExercise);
                await _db.SaveChangesAsync();
            }
        }

        //delete custom exercise by exerciseId
        public async Task DeleteCustomExerciseAsync(string userId, int exerciseId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {userId} не найден");
            }

            var isUser = await _userManager.IsInRoleAsync(user, UserRolesConstants.UserRole);
            if (!isUser)
            {
                var customExercise = await _db.CustomExerciseSet.FirstOrDefaultAsync(x => x.Id == exerciseId);
                if (customExercise == null)
                {
                    throw new EntityNotFoundException($"Упражнение с id: {exerciseId} не найдено");
                }

                if (!string.IsNullOrEmpty(customExercise.Path))
                {
                    File.Delete(customExercise.Path);
                }

                _db.CustomExerciseSet.Remove(customExercise);
                await _db.SaveChangesAsync();
            }
            else
            {
                var customExercise = await _db.CustomExerciseSet.FirstOrDefaultAsync(x => x.Id == exerciseId && x.User.Id == user.Id);
                if (customExercise == null)
                {
                    throw new EntityNotFoundException($"Упражнение с id: {exerciseId} не найдено");
                }

                if(!string.IsNullOrEmpty(customExercise.Path))
                {
                    File.Delete(customExercise.Path);
                }

                _db.CustomExerciseSet.Remove(customExercise);
                await _db.SaveChangesAsync();
            }
        }


        //edit custom exercise
        public async Task EditCustomExerciseAsync(EditCustomExerciseDTO exerciseInfo)
        {
            var user = await _userManager.FindByIdAsync(exerciseInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {exerciseInfo.UserId} не найден");
            }

            var currentExercise = await _db.CustomExerciseSet.FindAsync(exerciseInfo.ExerciseId);
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
