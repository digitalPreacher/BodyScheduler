using BodyShedule_v_2_0.Server.DataTransferObjects;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface ITrainingProgramRepository
    {
        public Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo);
        public Task<List<GetTrainingProgramsDTO>> GetTrainingProgramsAsync(string userId);
        public Task<List<GetTrainingProgramDTO>> GetTrainingProgramAsync(int trainingProgramId);

        public Task<bool> DeleteTrainingProgramAsync(int trainingProgramId);
        public Task<bool> EditTrainingProgramAsync(EditTrainingProgramDTO trainingProgramInfo);
    }
}
