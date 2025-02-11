using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface IExportExerciseTitlesRepository
    {
        public Task<List<GetCustomExerciseTitleDTO>> GetExerciseTitlesAsync(string userId);
    }
}
