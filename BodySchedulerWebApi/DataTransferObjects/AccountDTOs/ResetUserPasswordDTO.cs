﻿namespace BodySchedulerWebApi.DataTransferObjects.AccountDTOs
{
    public class ResetUserPasswordDTO
    {
        public string Token { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
