using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface IEventService
    {
        public Task<bool> AddEventAsync(AddEventDTO eventInfo);

        public Task<List<GetEventsDTO>> GetEventsAsync(string userId);
    }
}
