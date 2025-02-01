namespace BodyShedule_v_2_0.Server.Exceptions
{
    public class EntityNotFoundException : CustomException
    {
        public EntityNotFoundException(string message) : base(message) { }

        public EntityNotFoundException(string message, Exception innerException) : base(message, innerException) { }
    }
}
