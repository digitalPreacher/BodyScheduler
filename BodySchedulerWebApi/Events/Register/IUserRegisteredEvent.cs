using BodySchedulerWebApi.Models;

namespace BodySchedulerWebApi.Events.Register
{
    public interface IUserRegisteredEvent
    {
        ApplicationUser User { get; }
    }
}
