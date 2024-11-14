using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        [Key]
        public override int Id { get; set; }
        public bool IsSubscribed { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
    }
}
