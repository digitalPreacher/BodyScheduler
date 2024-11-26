using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface IEventService
    {
        public Task<bool> AddEventAsync(AddEventDTO eventInfo);
        public Task<List<GetEventsDTO>> GetEventsAsync(string userId, string status);
        public Task<bool> EditEventAsync(EditEventDTO eventInfo);
        public Task<List<GetEventDTO>> GetEventAsync(int id);
        public Task<bool> DeleteEventAsync(int id);

        public Task<bool> ChangeEventStatusAsync(ChangeEventStatusDTO eventStatusInfo);
    }
}
