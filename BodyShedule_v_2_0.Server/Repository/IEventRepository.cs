using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface IEventRepository
    {
        public Task<bool> AddEventAsync(AddEventDTO eventInfo);
        public Task<List<GetEventsDTO>> GetEventsAsync(string userId);
        public Task<bool> EditEventAsync(EditEventDTO eventInfo);
        public Task<GetEventDTO[]> GetEventAsync(int id);
        public Task<bool> DeleteEventAsync(int id);
    }
}
