namespace BodySchedulerWebApi.Exceptions
{
    public class EmailSendException : CustomException
    {
        public EmailSendException(string message) : base(message) { }
        public EmailSendException(string message, Exception innerException) : base(message, innerException) { }
    }
}
