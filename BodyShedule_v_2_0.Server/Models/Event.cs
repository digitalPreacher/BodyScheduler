using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodyShedule_v_2_0.Server.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Поле Title обязательно для заполнения")]
        [MaxLength(100)]
        public required string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Поле StartTime обязательно для заполнения")]
        public required DateTimeOffset StartTime { get; set; }
        public int? WeeksTrainingId { get; set; }
        public string? Status { get; set; }

        public ICollection<Exercise>? Exercises { get; set; }
        public virtual WeeksTraining? WeeksTraining { get; set; }

        public required virtual ApplicationUser User { get; set; } 

    }
}
