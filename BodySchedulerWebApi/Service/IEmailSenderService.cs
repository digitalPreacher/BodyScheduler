namespace BodyShedule_v_2_0.Server.Service
{
    public interface IEmailSenderService
    {
        public Task SendEmailPasswordResetAsync(string userEmail, string link);
        public Task SendEmailUserFeedbackAsync(string userEmail, string description);
    }
}
