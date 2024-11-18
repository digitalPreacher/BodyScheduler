namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class ResetUserPasswordDTO
    {
        public string Token { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
