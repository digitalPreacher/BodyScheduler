using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class ExportExerciseTitlesService : IExportExerciseTitlesService
    {
        private readonly IExportExerciseTitlesRepository _repository;

        public ExportExerciseTitlesService(IExportExerciseTitlesRepository repository)
        {
            _repository = repository;
        }
        public async Task<List<string>> GetExerciseTitlesAsync()
        {
            return await _repository.GetExerciseTitlesAsync();
        }
    }
}
