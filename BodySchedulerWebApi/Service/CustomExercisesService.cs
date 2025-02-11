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

        public async Task<GetCustomExercisesDTO> GetCustomExerciseAsync(int exerciseId)
        {
            return await _repository.GetCustomExerciseAsync(exerciseId);
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

        public async Task EditCustomExerciseAsync(EditCustomExerciseDTO exerciseInfo)
        {
            await _repository.EditCustomExerciseAsync(exerciseInfo);
        }
    }
}
