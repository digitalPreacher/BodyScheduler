namespace BodySchedulerWebApi.Service
{
    public interface IExportExerciseTitlesService
    {
        public Task<List<string>> GetExerciseTitlesAsync();
    }
}
