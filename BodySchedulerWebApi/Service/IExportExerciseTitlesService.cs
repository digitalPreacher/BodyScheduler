using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface IExportExerciseTitlesService
    {
        public Task<List<GetCustomExerciseTitleDTO>> GetExerciseTitlesAsync(string userId);
    }
}
