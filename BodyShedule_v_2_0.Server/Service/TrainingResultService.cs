using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Repository;

namespace BodyShedule_v_2_0.Server.Service
{
    public class TrainingResultService : ITrainingResultService
    {
        private readonly ITrainingResultRepository _repository;

        public TrainingResultService(ITrainingResultRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddTrainingResultAsync(TrainingResultDto trainingResultInfo)
        {
            return await _repository.AddTrainingResultAsync(trainingResultInfo);
        }
    }
}
