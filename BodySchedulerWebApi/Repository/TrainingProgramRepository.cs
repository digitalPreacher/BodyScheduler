using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs;
using BodyShedule_v_2_0.Server.Exceptions;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Reflection;

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

        //add new training program
        public async Task<bool> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo)
        {
            var user = await _userManager.FindByIdAsync(trainingProgramInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{trainingProgramInfo.UserId} не найден");
            }

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
            await _db.SaveChangesAsync();

            return true;
        }

        //get all user training programs
        public async Task<List<GetTrainingProgramsDTO>> GetTrainingProgramsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{userId} не найден");
            }

            var userRoleId = await _db.UserRoles.Where(x => x.UserId == user.Id).Select(x => x.RoleId).FirstOrDefaultAsync();
            var userRoleName = await _db.Roles.Where(x => x.Id == userRoleId).Select(x => x.Name).FirstOrDefaultAsync();

            //get list of training programs by user role
            if (userRoleName == "User")
            {
                var trainingProgramsList = await _db.TrainingProgramSet.Where(x => x.User.Id == user.Id).Select(x => new GetTrainingProgramsDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,  
                })
                .ToListAsync();

                return trainingProgramsList;
            }

            //get list of training programs by admin role
            if (userRoleName == "Admin")
            {
                var trainingProgramsList = await _db.TrainingProgramSet.Select(x => new GetTrainingProgramsDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                })
                .ToListAsync();

                return trainingProgramsList;
            }

            return new List<GetTrainingProgramsDTO>();
        }

        //get user training program
        public async Task<List<GetTrainingProgramDTO>> GetTrainingProgramAsync(int trainingProgramId)
        {
            var trainingProgramList = await _db.TrainingProgramSet.Where(x => x.Id == trainingProgramId)
                .Include(x => x.Weeks)
                .ThenInclude(x => x.Events)
                .ThenInclude(x => x.Exercises)
                .AsSplitQuery()
                .ToListAsync();

            var setTrainingProgram = new List<GetTrainingProgramDTO>();
            foreach (var trainingProgram in trainingProgramList)
            {
                var weeksList = new List<GetWeeksTrainingDTO>();
                foreach (var week in trainingProgram.Weeks)
                {
                    var eventsList = new List<GetEventDTO>();
                    if(week.Events != null)
                    {
                        foreach (var getEvent in week.Events)
                        {
                            var exercises = new List<ExerciseDTO>();
                            if(getEvent.Exercises != null)
                            {
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
                            }

                            eventsList.Add(new GetEventDTO
                            {
                                Id = getEvent.Id,
                                Title = getEvent.Title,
                                Description = getEvent.Description,
                                StartTime = getEvent.StartTime,
                                Status = getEvent.Status,
                                Exercises = exercises
                            });

                        }
                    }

                    weeksList.Add(new GetWeeksTrainingDTO
                    {
                        Id = week.Id,
                        WeekNumber = week.WeekNumber,
                        Events = eventsList
                    });
                }

                setTrainingProgram.Add(new GetTrainingProgramDTO
                {
                    Id = trainingProgram.Id,
                    Title = trainingProgram.Title,
                    Description = trainingProgram.Description,
                    Weeks = weeksList
                });
            }

            return setTrainingProgram;
        }

        //delete training program
        public async Task<bool> DeleteTrainingProgramAsync(int trainingProgramId)
        {
            var trainingProgram = await _db.TrainingProgramSet
                .Include(x => x.Weeks)
                .FirstOrDefaultAsync(x => x.Id == trainingProgramId);

            if (trainingProgram == null)
            {
                throw new EntityNotFoundException($"Запись с id: {trainingProgramId} не найдена");
            }

            //remove events
            if(trainingProgram.Weeks.Count > 0)
            {
                foreach(var week in trainingProgram.Weeks)
                {
                    var getEvent = _db.Events.Where(x => x.WeeksTrainingId == week.Id).Include(x => x.Exercises).ToList();
                    if(getEvent.Count > 0)
                    {
                        _db.RemoveRange(getEvent);
                    }
                }
            }

            _db.Remove(trainingProgram);
            await _db.SaveChangesAsync();

            return true;
        }

        //edit training program
        public async Task<bool> EditTrainingProgramAsync(EditTrainingProgramDTO trainingProgramInfo)
        {
            var user = await _userManager.FindByIdAsync(trainingProgramInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id: {trainingProgramInfo.UserId} не найден");
            }

            //set training program data recevied from the frontend
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
                    Events = weekDto.Events?.Select(eventDto => new Event
                    {
                        Id = eventDto.Id,
                        Title = eventDto.Title,
                        Description = eventDto.Description,
                        StartTime = eventDto.StartTime,
                        Status = eventDto.Status,
                        User = user,
                        Exercises = eventDto.Exercises?.Select(exerciseDto => new Exercise
                        {
                            Id = exerciseDto.Id,
                            Title = exerciseDto.Title,
                            QuantityApproaches = exerciseDto.QuantityApproaches,
                            QuantityRepetions = exerciseDto.QuantityRepetions,
                            Weight = exerciseDto.Weight,
                            User = user
                        }).ToList() ?? new List<Exercise>()
                    }).ToList() ?? new List<Event>()
                }).ToList()
            };


            //Attach trainingProgram and mark it as modified
            _db.TrainingProgramSet.Attach(trainingProgram);
            _db.Entry(trainingProgram).State = EntityState.Modified;

            var weekIds = trainingProgram.Weeks.Select(x => x.Id).ToList();
            var eventIds = trainingProgram.Weeks.SelectMany(x => x.Events.Select(k => k.Id)).ToList();
            var exerciseIds = trainingProgram.Weeks.SelectMany(x => x.Events.SelectMany(k => k.Exercises!.Select(j => j.Id))).ToList();

            var weeksDbList = _db.WeeksTrainingSet
                .Where(x => x.ProgramId == trainingProgramInfo.Id)
                .Include(x => x.Events)
                .ThenInclude(x => x.Exercises);

            //tracked delete entries and modified week number
            foreach (var week in weeksDbList)
            {
                //check weeks and make ti as modified/deleted state
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
                        if (getEvent.Exercises != null && getEvent.Exercises.Any())
                        {
                            foreach(var exercise in getEvent.Exercises)
                            {
                                _db.Entry(exercise).State = EntityState.Deleted;
                            }
                        }
                    }
                }
                else
                {
                    foreach (var getEvent in week.Events)
                    {
                        //check events and make ti as modified/deleted state
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
                            if(getEvent.Exercises != null)
                            {
                                foreach (var exercise in getEvent.Exercises)
                                {
                                    _db.Entry(exercise).State = EntityState.Deleted;
                                }
                            }
                        }
                        else
                        {
                            if (getEvent.Exercises != null && getEvent.Exercises.Any())
                            {
                                //check exercises and make ti as modified/deleted state
                                foreach (var exercise in getEvent.Exercises)
                                {
                                    if(matchEvent != null && matchEvent.Exercises != null && matchEvent.Exercises.Any())
                                    {
                                        var matchExercise = matchEvent.Exercises.FirstOrDefault(x => x.Id == exercise.Id);
                                        if(matchExercise != null && matchExercise.Id != 0)
                                        {
                                            exercise.Title = matchExercise.Title;
                                            exercise.QuantityApproaches = matchExercise.QuantityApproaches;
                                            exercise.QuantityRepetions = matchExercise.QuantityRepetions;
                                            exercise.Weight = matchExercise.Weight;
                                            _db.Entry(exercise).State = EntityState.Modified;
                                        }
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
            }

            await _db.SaveChangesAsync();

            return true;
        }
    }
}
