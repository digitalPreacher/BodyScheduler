using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.Models
{
    public class TrainingProgram
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public required ICollection<WeeksTraining> Weeks { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
