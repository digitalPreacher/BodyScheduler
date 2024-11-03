using BodyShedule_v_2_0.Server.DataTransferObjects;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface ITrainingProgramRepository
    {
        public Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo);
    }
}
