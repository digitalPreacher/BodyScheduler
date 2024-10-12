using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Repository;

namespace BodyShedule_v_2_0.Server.Service
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repository;

        public EventService(IEventRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddEventAsync(AddEventDTO eventInfo)
        {
            return await _repository.AddEventAsync(eventInfo);
        }

        public async Task<List<GetEventsDTO>> GetEventsAsync(string userId)
        {
            return await _repository.GetEventsAsync(userId);
        }
    }
}
