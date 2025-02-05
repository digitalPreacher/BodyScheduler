using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.Models
{
    public class UserErrorReport
    {
        [Key]
        public int Id { get; set; }
        public required string Email { get; set; }  
        public required string Description {  get; set; }
        public required DateTime CreateAt { get; set; }

    }
}
