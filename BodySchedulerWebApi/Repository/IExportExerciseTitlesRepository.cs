namespace BodySchedulerWebApi.Repository
{
    public interface IExportExerciseTitlesRepository
    {
        public Task<List<string>> GetExerciseTitlesAsync();
    }
}
