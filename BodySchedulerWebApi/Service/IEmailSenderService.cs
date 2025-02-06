namespace BodySchedulerWebApi.Service
{
    public interface IEmailSenderService
    {
        public Task SendEmailPasswordResetAsync(string userEmail, string link);
        public Task SendEmailUserFeedbackAsync(string userEmail, string description);
    }
}
