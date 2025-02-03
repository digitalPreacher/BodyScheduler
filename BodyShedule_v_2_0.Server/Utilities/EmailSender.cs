using BodyShedule_v_2_0.Server.Exceptions;
using System.Net.Mail;

namespace BodyShedule_v_2_0.Server.Utilities
{
    public static class EmailSender
    {
        public static bool SendEmailPasswordReset(string userEmail, string link)
        {
            var host = Environment.GetEnvironmentVariable("SMTP_HOST") ?? throw new ArgumentException("Invalid SMTP host");
            var port = int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT"), out int checkPort)
                ? checkPort : throw new ArgumentException("Invalid SMTP port");
            var userName = Environment.GetEnvironmentVariable("SMTP_HOST_LOGIN") ?? throw new ArgumentException("Invalid login to host");
            var password = Environment.GetEnvironmentVariable("SMTP_HOST_PASSWORD") ?? throw new ArgumentException("Invalid login to host");
            var senderEmail = Environment.GetEnvironmentVariable("SMTP_SENDER_EMAIL") ?? throw new ArgumentException("Invalid email sender");
            try
            {
                using MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(senderEmail);
                mailMessage.To.Add(new MailAddress(userEmail));

                mailMessage.Subject = "Сброс пароля";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = link;

                using SmtpClient client = new SmtpClient();
                client.Credentials = new System.Net.NetworkCredential(userName, password);
                client.Host = host;
                client.EnableSsl = true;
                client.Port = port;
                client.UseDefaultCredentials = false;

                client.Send(mailMessage);
            }
            catch(Exception ex)
            {
                throw new EmailSendException(ex.Message);
            }
            return true;
        
        }

        public static bool SendEmailUserFeedback(string userEmail, string description)
        {
            var host = Environment.GetEnvironmentVariable("SMTP_HOST") ?? throw new ArgumentException("Invalid SMTP host");
            var port = int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT"), out int checkPort)
                ? checkPort : throw new ArgumentException("Invalid SMTP port");
            var userName = Environment.GetEnvironmentVariable("SMTP_HOST_LOGIN") ?? throw new ArgumentException("Invalid login to host");
            var password = Environment.GetEnvironmentVariable("SMTP_HOST_PASSWORD") ?? throw new ArgumentException("Invalid login to host");
            var emailSender = Environment.GetEnvironmentVariable("SMTP_FEEDBACK_SENDER_EMAIL") ?? throw new ArgumentException("Invalid sender email");
            var emailGetter = Environment.GetEnvironmentVariable("SMTP_FEEDBACK_GETTER_EMAIL") ?? throw new ArgumentException("Invalid getter email");

            try
            {
                using MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(emailSender);
                mailMessage.To.Add(new MailAddress(emailGetter));

                mailMessage.Subject = $"Сообщение о проблеме";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = $"<p>Описание: {description}<p>" +
                    $"<p>Email: {userEmail}<p>";

                using SmtpClient client = new SmtpClient();
                client.Credentials = new System.Net.NetworkCredential(userName, password);
                client.Host = host;
                client.EnableSsl = true;
                client.Port = port;
                client.UseDefaultCredentials = false;

                client.Send(mailMessage);
            }
            catch (Exception ex)
            {
                throw new EmailSendException(ex.Message);
            }

            return true;
        }
    }
}
