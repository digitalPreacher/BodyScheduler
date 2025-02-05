using BodyShedule_v_2_0.Server.Repository;

namespace BodyShedule_v_2_0.Server.Service
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
