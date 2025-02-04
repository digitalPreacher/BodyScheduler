using BodyShedule_v_2_0.Server.Exceptions;
using BodyShedule_v_2_0.Server.Utilities;
using Microsoft.Extensions.Hosting;
using System.Net.Mail;

namespace BodyShedule_v_2_0.Server.Service
{
    public class EmailSenderService : IEmailSenderService
    {
        private readonly string _host;
        private readonly int _port;
        private readonly string _hostUserName;
        private readonly string _hostPassword;
        private readonly string _senderEmail;
        private readonly string _feedbackSenderEmail;
        private readonly string _feedbackGetterEmail;

        public EmailSenderService()
        {
            _host = Environment.GetEnvironmentVariable("SMTP_HOST") ?? throw new ArgumentException("Invalid SMTP host");
            _port = int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT"), out int checkPort)
                ? checkPort : throw new ArgumentException("Invalid SMTP port");
            _hostUserName = Environment.GetEnvironmentVariable("SMTP_HOST_LOGIN") ?? throw new ArgumentException("Invalid login to host");
            _hostPassword = Environment.GetEnvironmentVariable("SMTP_HOST_PASSWORD") ?? throw new ArgumentException("Invalid login to host");
            _senderEmail = Environment.GetEnvironmentVariable("SMTP_SENDER_EMAIL") ?? throw new ArgumentException("Invalid email sender");
            _feedbackSenderEmail = Environment.GetEnvironmentVariable("SMTP_FEEDBACK_SENDER_EMAIL") ?? throw new ArgumentException("Invalid sender email");
            _feedbackGetterEmail = Environment.GetEnvironmentVariable("SMTP_FEEDBACK_GETTER_EMAIL") ?? throw new ArgumentException("Invalid getter email");
        }

        //send link to reset user password to user email 
        public async Task SendEmailPasswordResetAsync(string userEmail, string link)
        {
            using MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_senderEmail);
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Сброс пароля";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = link;

            using SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential(_hostUserName, _hostPassword);
            client.Host = _host;
            client.EnableSsl = true;
            client.Port = _port;
            client.UseDefaultCredentials = false;

            await client.SendMailAsync(mailMessage);
        }

        //send user feedback to owner app 
        public async Task SendEmailUserFeedbackAsync(string userEmail, string description)
        {
            using MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_feedbackSenderEmail);
            mailMessage.To.Add(new MailAddress(_feedbackGetterEmail));

            mailMessage.Subject = $"Сообщение о проблеме";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = $"<p>Описание: {description}<p>" +
                $"<p>Email: {userEmail}<p>";

            using SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential(_hostUserName, _hostPassword);
            client.Host = _host;
            client.EnableSsl = true;
            client.Port = _port;
            client.UseDefaultCredentials = false;

            await client.SendMailAsync(mailMessage);
        }

    }
}
