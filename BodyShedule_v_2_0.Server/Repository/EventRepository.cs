using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public EventRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public async Task<bool> AddEventAsync(AddEventDTO eventInfo)
        {
            var user = await _userManager.FindByIdAsync(eventInfo.UserId);
            if (user != null)
            {
                var exercises = eventInfo.Exercises.Select(x => new Exercise
                {
                    User = user,
                    Title = x.Title,
                    QuantityApproaches = x.QuantityApproaches,
                    QuantityRepetions = x.QuantityRepetions,
                    Weight = x.Weight
                })
                .ToList() ;

                Event eventModel = new Event
                {
                    User = user,
                    Title = eventInfo.Title,
                    Description = eventInfo.Description,
                    StartTime = eventInfo.StartTime,
                    Exercises = exercises
                };

                await _db.AddAsync(eventModel);
                _db.SaveChanges();

                return true;
            }

            return false;
        }

        public async Task<List<GetEventsDTO>> GetEventsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var events = await _db.Events.Where(x => x.User == user).Select(x => new GetEventsDTO
            {
                Id = x.Id.ToString(),
                Title = x.Title,
                Description = x.Description,
                Start = x.StartTime,
            })
            .ToListAsync();

            return events;
        }

        public async Task<bool> EditEventAsync(EditEventDTO eventInfo)
        {
            var user = await _userManager.FindByIdAsync(eventInfo.UserId);
            if (user != null)
            {
                Event editEvent = new Event
                {
                    Id = eventInfo.Id,
                    Title = eventInfo.Title,
                    Description = eventInfo.Description,
                    StartTime = eventInfo.StartTime,
                    User = user
                };

                List<Exercise> getExercises = eventInfo.Exercises.Select(x => new Exercise
                {
                    Id = x.Id > 0 ? x.Id : 0,
                    Title = x.Title,
                    QuantityApproaches = x.QuantityApproaches,
                    QuantityRepetions = x.QuantityRepetions,
                    Weight = x.Weight,
                    Event = editEvent
                })
                .ToList();

                foreach(var exercise in getExercises)
                {
                    if(exercise.Id > 0)
                    {
                        _db.Entry(exercise).State = EntityState.Modified;

                    }
                    else
                    {
                        Exercise newExercise = new Exercise
                        {
                            Title = exercise.Title,
                            QuantityApproaches = exercise.QuantityApproaches,
                            QuantityRepetions = exercise.QuantityRepetions,
                            Weight = exercise.Weight,
                            Event = editEvent,
                            User = user,
                            EventId = exercise.Id,
                            CreateAt = DateTime.Now.ToUniversalTime(),
                        };

                        _db.Entry(newExercise).State = EntityState.Added;
                    }
                }

                List<Exercise> eventExercises = _db.Exercises.Where(x => x.EventId == eventInfo.Id).ToList();
                foreach(var exercise in eventExercises)
                {
                    if (!getExercises.Contains(exercise))
                    {
                        _db.Entry(exercise).State = EntityState.Deleted;
                    }
                }

                _db.Events.Attach(editEvent);
                _db.Entry(editEvent).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return true;
            }

            return false;
        }

        public async Task<GetEventDTO[]> GetEventAsync(int id)
        {
            var getEvent = _db.Events.Where(x => x.Id == id).Select(x => new GetEventDTO
            {
                Id = x.Id.ToString(),
                Title = x.Title,
                Description = x.Description,
                StartTime = x.StartTime,
                Exercises = x.Exercises.Select(x => new ExerciseDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    QuantityApproaches = x.QuantityApproaches,
                    QuantityRepetions = x.QuantityRepetions,
                    Weight = x.Weight
                })
                .ToArray()
            });
            

            return getEvent.ToArray();
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            var getEvent = await _db.Events.FirstOrDefaultAsync(x => x.Id == id);

            if (getEvent != null) 
            {
                _db.Remove(getEvent);
                _db.SaveChanges();

                return true;
            }
            else
            {
                return false;
            }

        }

        public async Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo)
        {
            var user = await _userManager.FindByIdAsync(trainingProgramInfo.UserId);
            if (user != null)
            {
                var weeksTraining = new List<WeeksTraining>();
                
                foreach(var week in trainingProgramInfo.Weeks)
                {
                    var weekEvents = new List<Event>();

                    foreach(var eventInfo in week.Events)
                    {
                        var exercises = new List<Exercise>();

                        foreach(var exercise in eventInfo.Exercises)
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
