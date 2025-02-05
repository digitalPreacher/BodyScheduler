using BodyShedule_v_2_0.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class ExportExerciseTitlesRepository : IExportExerciseTitlesRepository
    {
        private readonly ApplicationDbContext _db;

        public ExportExerciseTitlesRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        
        //get titles to exercise fields in event and training program forms
        public async Task<List<string>> GetExerciseTitlesAsync()
        {
            var exerciseTitlesList = await _db.ExerciseTitleSet.Select(x => x.Title).ToListAsync();
            return exerciseTitlesList;
        }
    }
}
