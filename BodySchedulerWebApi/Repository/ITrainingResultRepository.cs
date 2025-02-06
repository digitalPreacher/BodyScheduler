using BodySchedulerWebApi.DataTransferObjects.EventDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface ITrainingResultRepository
    {
        public Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo);
        public Task<List<GetTrainingResults>> GetTrainingResultsAsync(string userId);
    }
}
