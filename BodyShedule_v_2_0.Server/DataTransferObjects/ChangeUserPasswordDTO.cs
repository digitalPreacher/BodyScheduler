namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class ChangeUserPasswordDTO
    {
        public string UserLogin { get; set; }  
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
