using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

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

        public async Task<List<GetTrainingProgramsDTO>> GetTrainingProgramsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            var trainingProgramsList = await _db.TrainingProgramSet.Where(x => x.User.Id == user.Id).Select(x => new GetTrainingProgramsDTO
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,  
            })
            .ToListAsync();

            return trainingProgramsList;
        }

        public async Task<List<GetTrainingProgramDTO>> GetTrainingProgramAsync(int trainingProgramId)
        {
            var trainingProgramsList = await _db.TrainingProgramSet.Where(x => x.Id == trainingProgramId)
                .Include(x => x.Weeks)
                .ThenInclude(x => x.Events)
                .ThenInclude(x => x.Exercises)
                .AsSplitQuery()
                .ToListAsync();

            var trainingPrograms = new List<GetTrainingProgramDTO>();

            foreach (var trainingProgram in trainingProgramsList)
            {
                var weeksList = new List<GetWeeksTrainingDTO>();

                foreach (var week in trainingProgram.Weeks)
                {
                    var eventsList = new List<GetEventDTO>();

                    foreach (var getEvent in week.Events)
                    {
                        var exercises = new List<ExerciseDTO>();

                        foreach (var exercise in getEvent.Exercises)
                        {
                            exercises.Add(new ExerciseDTO
                            {
                                Id = exercise.Id,
                                Title = exercise.Title,
                                QuantityApproaches = exercise.QuantityApproaches,
                                QuantityRepetions = exercise.QuantityRepetions,
                                Weight = exercise.Weight,
                            });
                        }

                        eventsList.Add(new GetEventDTO
                        {
                            Id = getEvent.Id,
                            Title = getEvent.Title,
                            Description = getEvent.Description,
                            StartTime = getEvent.StartTime,
                            Exercises = exercises
                        });

                    }

                    weeksList.Add(new GetWeeksTrainingDTO
                    {
                        Id = week.Id,
                        WeekNumber = week.WeekNumber,
                        Events = eventsList
                    });
                }

                trainingPrograms.Add(new GetTrainingProgramDTO
                {
                    Id = trainingProgram.Id,
                    Title = trainingProgram.Title,
                    Description = trainingProgram.Description,
                    Weeks = weeksList
                });
            }

            return trainingPrograms;
        }

        public async Task<bool> DeleteTrainingProgramAsync(int trainingProgramId)
        {
            var trainingProgram = await _db.TrainingProgramSet
                .Include(x => x.Weeks)
                .ThenInclude(x => x.Events)
                .ThenInclude(x => x.Exercises)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == trainingProgramId);


            if(trainingProgram != null)
            {
                _db.Remove(trainingProgram);
                _db.SaveChanges();

                return true;
            }

            return false;
        }

        public async Task<bool> EditTrainingProgramAsync(EditTrainingProgramDTO trainingProgramInfo)
        {
            var user = await _userManager.FindByIdAsync(trainingProgramInfo.UserId);
            if(user != null)
            {
                var trainingProgram = new TrainingProgram
                {
                    Id = trainingProgramInfo.Id,
                    Title = trainingProgramInfo.Title,
                    Description = trainingProgramInfo.Description,
                    User = user,
                    Weeks = trainingProgramInfo.Weeks.Select(weekDto => new WeeksTraining
                    {
                        Id = weekDto.Id,
                        WeekNumber = weekDto.WeekNumber,
                        User = user,
                        Events = weekDto.Events.Select(eventDto => new Event
                        {
                            Id = eventDto.Id,
                            Title = eventDto.Title,
                            Description = eventDto.Description,
                            StartTime = eventDto.StartTime,
                            User = user,
                            Exercises = eventDto.Exercises.Select(exerciseDto => new Exercise
                            {
                                Id = exerciseDto.Id,
                                Title = exerciseDto.Title,
                                QuantityApproaches = exerciseDto.QuantityApproaches,
                                QuantityRepetions = exerciseDto.QuantityRepetions,
                                Weight = exerciseDto.Weight,
                                User = user
                            }).ToList() 
                        }).ToList() 
                    }).ToList() 
                };

                var weeksDbList = _db.WeeksTrainingSet
                    .Where(x => x.ProgramId == trainingProgramInfo.Id)
                    .Include(x => x.Events)
                    .ThenInclude(x => x.Exercises)
                    .AsSingleQuery();

                //Attach trainingProgram and mark it as modified
                _db.TrainingProgramSet.Attach(trainingProgram);
                _db.Entry(trainingProgram).State = EntityState.Modified;

                var weekIds = trainingProgram.Weeks.Select(x => x.Id).ToList();
                var eventIds = trainingProgram.Weeks.SelectMany(x => x.Events.Select(k => k.Id)).ToList();
                var exerciseIds = trainingProgram.Weeks.SelectMany(x => x.Events.SelectMany(k => k.Exercises.Select(j => j.Id))).ToList();

                //tracked delete entries and modified week number
                foreach (var week in weeksDbList)
                {
                    var matchingWeek = trainingProgram.Weeks.FirstOrDefault(w => w.Id == week.Id);
                    if(matchingWeek != null)
                    {
                        week.WeekNumber = matchingWeek.WeekNumber;
                        _db.Entry(week).State = EntityState.Modified;
                    }

                    if (!weekIds.Contains(week.Id))
                    {
                        _db.Entry(week).State = EntityState.Deleted;
                        foreach(var getEvent in week.Events)
                        {
                            _db.Entry(getEvent).State = EntityState.Deleted;

                            foreach(var exercise in getEvent.Exercises)
                            {
                                _db.Entry(exercise).State = EntityState.Deleted;
                            }
                        }
                    }
                    else
                    {
                        foreach (var getEvent in week.Events)
                        {
                            var matchEvent = matchingWeek?.Events.FirstOrDefault(x => x.Id == getEvent.Id);
                            if (matchEvent != null && matchEvent.Id != 0)
                            {
                                getEvent.Title = matchEvent.Title;
                                getEvent.Description = matchEvent.Description;
                                getEvent.StartTime = matchEvent.StartTime;
                                _db.Entry(getEvent).State = EntityState.Modified;
                            }

                            if (!eventIds.Contains(getEvent.Id))
                            {
                                _db.Entry(getEvent).State = EntityState.Deleted;

                                foreach (var exercise in getEvent.Exercises)
                                {
                                    _db.Entry(exercise).State = EntityState.Deleted;
                                }
                            }
                            else
                            {
                                foreach (var exercise in getEvent.Exercises)
                                {
                                    var matchExercise = matchEvent?.Exercises.FirstOrDefault(x => x.Id == exercise.Id);
                                    if(matchExercise != null && matchExercise.Id != 0)
                                    {
                                        exercise.Title = matchExercise.Title;
                                        exercise.QuantityApproaches = matchExercise.QuantityApproaches;
                                        exercise.QuantityRepetions = matchExercise.QuantityRepetions;
                                        exercise.Weight = matchExercise.Weight;
                                        _db.Entry(exercise).State = EntityState.Modified;
                                    }


                                    if (!exerciseIds.Contains(exercise.Id))
                                    {
                                        _db.Entry(exercise).State = EntityState.Deleted;
                                    }
                                }
                            }
                        }
                    }
                }

                await _db.SaveChangesAsync();

                return true;

            }

            return false;
        }
    }
}
