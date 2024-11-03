using BodyShedule_v_2_0.Server.DataTransferObjects;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface ITrainingProgramService
    {
        public Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo);
    }
}
