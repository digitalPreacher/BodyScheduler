using BodySchedulerWebApi.DataTransferObjects.TrainingProgramDTOs;
using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class TrainingProgramService : ITrainingProgramService
    {
        private readonly ITrainingProgramRepository _repository;

        public TrainingProgramService(ITrainingProgramRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo)
        {
            return await _repository.AddTrainingProgramAsync(trainingProgramInfo);
        }

        public async Task<List<GetTrainingProgramsDTO>> GetTrainingProgramsAsync(string userId)
        {
            return await _repository.GetTrainingProgramsAsync(userId);
        }

        public async Task<List<GetTrainingProgramDTO>> GetTrainingProgramAsync(int trainingProgramId)
        {
            return await _repository.GetTrainingProgramAsync(trainingProgramId);
        }

        public async Task<bool> DeleteTrainingProgramAsync(int trainingProgramId)
        {
            return await _repository.DeleteTrainingProgramAsync(trainingProgramId);
        }

        public async Task<bool> EditTrainingProgramAsync(EditTrainingProgramDTO trainingProgramInfo)
        {
            return await _repository.EditTrainingProgramAsync(trainingProgramInfo);
        }
    }
}
