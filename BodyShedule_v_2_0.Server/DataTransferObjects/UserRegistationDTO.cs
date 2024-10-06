using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class UserRegistationDTO
    {
        [Required]
        public string Login { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;
    }
}
