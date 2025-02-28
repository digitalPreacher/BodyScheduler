﻿using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.EventDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Repository
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

        //add new event 
        public async Task<bool> AddEventAsync(AddEventDTO eventInfo)
        {
            var user = await _userManager.FindByIdAsync(eventInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{eventInfo.UserId} не найден");
            }

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
            await _db.SaveChangesAsync();

            return true;
        }

        //get all user events
        public async Task<List<GetEventsDTO>> GetEventsAsync(string userId, string status)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{userId} не найден");
            }

            var userRoleId = await _db.UserRoles.Where(x => x.UserId == user.Id).Select(x => x.RoleId).FirstOrDefaultAsync();
            var userRoleName = await _db.Roles.Where(x => x.Id == userRoleId).Select(x => x.Name).FirstOrDefaultAsync();

            //get list of events by user role
            if(userRoleName == "User")
            {
                var events = await _db.Events.Where(x => x.User == user && x.Status == status).Select(x => new GetEventsDTO
                {
                    Id = x.Id.ToString(),
                    Title = x.Title,
                    Description = x.Description,
                    Start = x.StartTime,
                    Status = x.Status
                })
                .OrderByDescending(x => x.Id)
                .ToListAsync();
                
                return events;
            }

            //get list of events by admin role
            if (userRoleName == "Admin")
            {
                var events = await _db.Events.Where(x => x.Status == status).Select(x => new GetEventsDTO
                {
                    Id = x.Id.ToString(),
                    Title = x.Title,
                    Description = x.Description,
                    Start = x.StartTime,
                    Status = x.Status
                })
                .OrderByDescending(x => x.Id)
                .ToListAsync();

                return events;
            }

            return new List<GetEventsDTO>();
        }

        //edit user event
        public async Task<bool> EditEventAsync(EditEventDTO eventInfo)
        {
            var user = await _userManager.FindByIdAsync(eventInfo.UserId);
            if (user == null)
            {
                throw new EntityNotFoundException($"Пользователь с id:{eventInfo.UserId} не найден");
            }

            Event editEvent = new Event
            {
                Id = eventInfo.Id,
                Title = eventInfo.Title,
                Description = eventInfo.Description,
                StartTime = eventInfo.StartTime,
                Status = eventInfo.Status,
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
                        EventId = exercise.Id
                    };

                    _db.Entry(newExercise).State = EntityState.Added;
                }
            }

            List<Exercise> eventExercises = await _db.Exercises.Where(x => x.EventId == eventInfo.Id).ToListAsync();
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

        //get user event
        public async Task<List<GetEventDTO>> GetEventAsync(int id)
        {
            var getEvent = _db.Events.Where(x => x.Id == id).Select(x => new GetEventDTO
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                StartTime = x.StartTime,
                Status = x.Status,
                Exercises = x.Exercises.Select(x => new ExerciseDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    QuantityApproaches = x.QuantityApproaches,
                    QuantityRepetions = x.QuantityRepetions,
                    Weight = x.Weight
                })
                .ToList()
            });

            if(getEvent == null)
            {
                throw new EntityNotFoundException($"Запись с id: {id} не найдена");
            }
            
            return await getEvent.ToListAsync();
        }

        //delete user event
        public async Task<bool> DeleteEventAsync(int id)
        {
            var getEvent = await _db.Events.FirstOrDefaultAsync(x => x.Id == id);
            if (getEvent == null)
            {
                throw new EntityNotFoundException($"Запись с id:{id} не найдена");
            }

            _db.Remove(getEvent);
            await _db.SaveChangesAsync();

            return true;
        }

        //change event status
        public async Task<bool> ChangeEventStatusAsync(ChangeEventStatusDTO eventStatusInfo)
        {
            var getEvent = await _db.Events.FirstOrDefaultAsync(x => x.Id == eventStatusInfo.Id);
            if (getEvent == null)
            {
                throw new EntityNotFoundException($"Запись с id:{eventStatusInfo.Id} не найдена");
            }
   
            if (eventStatusInfo.Status == "completed")
            {
                getEvent.EndTime = DateTime.Now;
            }

            getEvent.Status = eventStatusInfo.Status;


            _db.Entry(getEvent).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return true;
        }
    }
}
