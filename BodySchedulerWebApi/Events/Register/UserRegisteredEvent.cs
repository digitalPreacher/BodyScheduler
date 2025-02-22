using BodySchedulerWebApi.Models;
using MediatR;

namespace BodySchedulerWebApi.Events.Register
{
    public class UserRegisteredEvent : IUserRegisteredEvent, INotification
    {
        public UserRegisteredEvent(ApplicationUser user) 
        {
            User = user;
        }

        public ApplicationUser User { get; set; }
    }
}
