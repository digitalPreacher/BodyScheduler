using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface ICustomExercisesService
    {
        public Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo);
    }
}
