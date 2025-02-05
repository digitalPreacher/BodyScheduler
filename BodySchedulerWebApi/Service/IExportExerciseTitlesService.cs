namespace BodyShedule_v_2_0.Server.Service
{
    public interface IExportExerciseTitlesService
    {
        public Task<List<string>> GetExerciseTitlesAsync();
    }
}
