using BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface ITrainingProgramService
    {
        public Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo);
        public Task<List<GetTrainingProgramsDTO>> GetTrainingProgramsAsync(string userId);
        public Task<List<GetTrainingProgramDTO>> GetTrainingProgramAsync(int trainingProgramId);
        public Task<bool> DeleteTrainingProgramAsync(int trainingProgramId);
        public Task<bool> EditTrainingProgramAsync(EditTrainingProgramDTO trainingProgramInfo);
    }
}
