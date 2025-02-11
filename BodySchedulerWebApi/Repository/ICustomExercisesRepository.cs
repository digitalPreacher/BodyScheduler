﻿using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface ICustomExercisesRepository
    {
        public Task AddCustomExercisesAsync(AddCustomExerciseDTO exerciseInfo);
        public Task<List<GetCustomExercisesDTO>> GetCustomExercisesAsync(string userId);
        public Task<GetCustomExercisesDTO> GetCustomExerciseAsync(int exerciseId);
        public Task DeleteCustomExerciseAsync(string userId, int exerciseId);
        public Task EditCustomExerciseAsync(EditCustomExerciseDTO exerciseInfo);
    }
}
