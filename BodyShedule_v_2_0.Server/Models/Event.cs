using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTimeOffset StartTime { get; set; }
        public ICollection<Exercise>? Exercises { get; set; }
        public virtual ApplicationUser? User { get; set; }

    }
}
