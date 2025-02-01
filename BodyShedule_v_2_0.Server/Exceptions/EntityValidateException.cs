namespace BodyShedule_v_2_0.Server.Exceptions
{
    public class EntityValidateException : CustomException
    {
        public EntityValidateException(string message) : base(message) { }

        public EntityValidateException(string message, Exception innerException) : base(message, innerException) { }
    }
}
