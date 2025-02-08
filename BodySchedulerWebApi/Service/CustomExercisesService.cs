using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class CustomExercisesService : ICustomExercisesService
    {
        private readonly ICustomExercisesRepository _repository;

        public CustomExercisesService(ICustomExercisesRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<GetCustomExercisesDTO>> GetCustomExercisesAsync(string userId)
        {
            return await _repository.GetCustomExercisesAsync(userId);
        }

        public async Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo)
        {
            await _repository.AddCustomExercisesAsync(exerciseInfo);
        }

        public async Task DeleteCustomExerciseAsync(string userId, int exerciseId)
        {
            await _repository.DeleteCustomExerciseAsync(userId, exerciseId);
        }
    }
}
