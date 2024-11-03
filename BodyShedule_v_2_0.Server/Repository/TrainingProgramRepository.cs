using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class TrainingProgramRepository : ITrainingProgramRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public TrainingProgramRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public async Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo)
        {
            var user = await _userManager.FindByIdAsync(trainingProgramInfo.UserId);
            if (user != null)
            {
                var weeksTraining = new List<WeeksTraining>();

                foreach (var week in trainingProgramInfo.Weeks)
                {
                    var weekEvents = new List<Event>();

                    foreach (var eventInfo in week.Events)
                    {
                        var exercises = new List<Exercise>();

                        foreach (var exercise in eventInfo.Exercises)
                        {
                            exercises.Add(new Exercise
                            {
                                Title = exercise.Title,
                                QuantityApproaches = exercise.QuantityApproaches,
                                QuantityRepetions = exercise.QuantityRepetions,
                                Weight = exercise.Weight,
                                User = user
                            });
                        }

                        weekEvents.Add(new Event
                        {
                            User = user,
                            Title = eventInfo.Title,
                            Description = eventInfo.Description,
                            StartTime = eventInfo.StartTime,
                            Exercises = exercises

                        });
                    }

                    weeksTraining.Add(new WeeksTraining
                    {
                        User = user,
                        WeekNumber = week.WeekNumber,
                        Events = weekEvents
                    });
                }


                TrainingProgram trainingProgram = new TrainingProgram
                {
                    Title = trainingProgramInfo.Title,
                    Description = trainingProgramInfo.Description,
                    Weeks = weeksTraining,
                    User = user,
                };

                await _db.AddRangeAsync(trainingProgram);
                _db.SaveChanges();

                return true;
            }

            return false;
        }

    }
}
