using BodySchedulerWebApi.Events.Register;
using BodySchedulerWebApi.Service;
using MediatR;

namespace BodySchedulerWebApi.Events.Handlers
{
    public class AchievementEventHandler : INotificationHandler<UserRegisteredEvent>
    {
        private readonly IAchievementService _achievementService;
        public AchievementEventHandler(IAchievementService achievementService) 
        { 
            _achievementService = achievementService;
        }

        public async Task Handle(UserRegisteredEvent notification, CancellationToken cancellationToken)
        {
            await _achievementService.AddAchievementsAsync(notification.User);
        }
    }
}
