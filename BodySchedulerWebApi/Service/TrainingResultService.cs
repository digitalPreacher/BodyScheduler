using BodySchedulerWebApi.DataTransferObjects.EventDTOs;
using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class TrainingResultService : ITrainingResultService
    {
        private readonly ITrainingResultRepository _repository;

        public TrainingResultService(ITrainingResultRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<GetTrainingResults>> GetTrainingResultsAsync(string userId)
        {
            return await _repository.GetTrainingResultsAsync(userId);
        }

        public async Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo)
        {
            return await _repository.AddTrainingResultAsync(trainingResultInfo);
        }
    }
}
