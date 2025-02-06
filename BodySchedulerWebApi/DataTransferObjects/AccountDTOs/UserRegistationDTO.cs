namespace BodySchedulerWebApi.DataTransferObjects.AccountDTOs
{
    public class UserRegistationDTO
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool AcceptedAgreement {  get; set; } 
    }
}
