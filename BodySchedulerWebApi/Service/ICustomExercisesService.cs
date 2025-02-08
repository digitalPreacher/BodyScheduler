using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface ICustomExercisesService
    {
        public Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo);
        public Task<List<GetCustomExercisesDTO>> GetExercisesAsync(string userId);
    }
}
