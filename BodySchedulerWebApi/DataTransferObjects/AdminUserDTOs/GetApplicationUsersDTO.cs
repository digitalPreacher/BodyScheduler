namespace BodySchedulerWebApi.DataTransferObjects.AdminUserDTOs
{
    public class GetApplicationUsersDTO
    {
        public int Id { get; set; }
        public string? UserName { get; set; }

        public string? Email { get; set; }
    }
}
