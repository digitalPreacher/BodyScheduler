using BodySchedulerWebApi.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Models;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface ITrainingResultService
    {
        public Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo);
        public Task<List<GetTrainingResults>> GetTrainingResultsAsync(string userId);
    }
}
