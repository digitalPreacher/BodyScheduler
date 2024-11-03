using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Repository;

namespace BodyShedule_v_2_0.Server.Service
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
    }
}
