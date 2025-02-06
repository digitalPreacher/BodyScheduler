using BodySchedulerWebApi.DataTransferObjects.EventDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface ITrainingResultService
    {
        public Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo);
        public Task<List<GetTrainingResults>> GetTrainingResultsAsync(string userId);
    }
}
