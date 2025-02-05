using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Models;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface ITrainingResultRepository
    {
        public Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo);
    }
}
