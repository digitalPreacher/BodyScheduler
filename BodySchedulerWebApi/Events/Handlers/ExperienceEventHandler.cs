using BodySchedulerWebApi.Events.Register;
using BodySchedulerWebApi.Service;
using MediatR;

namespace BodySchedulerWebApi.Events.Handlers
{
    public class ExperienceEventHandler : INotificationHandler<UserRegisteredEvent>
    {
        private readonly IUserExperienceService _userExperienceService;
        public ExperienceEventHandler(IUserExperienceService userExperienceService) 
        { 
            _userExperienceService = userExperienceService;
        }

        public async Task Handle(UserRegisteredEvent notification, CancellationToken cancellationToken)
        {
            await _userExperienceService.AddUserExperienceAsync(notification.User);
        }
    }
}
