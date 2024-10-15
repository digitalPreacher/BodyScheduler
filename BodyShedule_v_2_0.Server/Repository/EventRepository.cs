using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
                EventModel eventModel = new EventModel
                {
                    User = user,
                    Title = eventInfo.Title,
                    Description = eventInfo.Description,
                    StartTime = eventInfo.StartTime,
                    EndTime = eventInfo.EndTime,
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
                End = x.EndTime
            })
            .ToListAsync();

            return events;
        }

        public async Task<bool> EditEventAsync(EditEventDTO eventInfo)
        {
            var user = await _userManager.FindByIdAsync(eventInfo.UserId);
            if (user != null)
            {
                EventModel editEvent = new EventModel
                {
                    Id = eventInfo.Id,
                    Title = eventInfo.Title,
                    Description = eventInfo.Description,
                    StartTime = eventInfo.StartTime,
                    EndTime = eventInfo.EndTime,
                    User = user
                };
                
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
                EndTime = x.EndTime,
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
    }
}
