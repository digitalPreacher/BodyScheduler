using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface ICustomExercisesRepository
    {
        public Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo);
    }
}
