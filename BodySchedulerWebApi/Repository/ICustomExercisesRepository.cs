using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface ICustomExercisesRepository
    {
        public Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo);
        public Task<List<GetCustomExercisesDTO>> GetExercisesAsync(string userId);
    }
}
