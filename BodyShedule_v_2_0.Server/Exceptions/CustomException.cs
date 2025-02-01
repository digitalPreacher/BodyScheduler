namespace BodyShedule_v_2_0.Server.Exceptions
{
    public class CustomException : Exception
    {
        public CustomException(string message) : base(message) { }

        public CustomException(string message, Exception innerException) : base(message, innerException) { }
    }
}
