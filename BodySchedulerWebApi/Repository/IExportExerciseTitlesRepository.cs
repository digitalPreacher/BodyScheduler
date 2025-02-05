namespace BodyShedule_v_2_0.Server.Repository
{
    public interface IExportExerciseTitlesRepository
    {
        public Task<List<string>> GetExerciseTitlesAsync();
    }
}
