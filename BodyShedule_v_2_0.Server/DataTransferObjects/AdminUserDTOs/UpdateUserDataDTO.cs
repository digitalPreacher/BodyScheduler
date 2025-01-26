namespace BodyShedule_v_2_0.Server.DataTransferObjects.AdminUserDTOs
{
    public class UpdateUserDataDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }    
    }
}
