namespace BodyShedule_v_2_0.Server.DataTransferObjects.AccountDTOs
{
    public class ChangeUserPasswordDTO
    {
        public string UserLogin { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
