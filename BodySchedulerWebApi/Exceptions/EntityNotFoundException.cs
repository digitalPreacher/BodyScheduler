﻿namespace BodySchedulerWebApi.Exceptions
{
    public class EntityNotFoundException : CustomException
    {
        public EntityNotFoundException(string message) : base(message) { }

        public EntityNotFoundException(string message, Exception innerException) : base(message, innerException) { }
    }
}
