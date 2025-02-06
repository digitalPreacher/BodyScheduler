using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class TrainingProgram
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Поле Title обязательно для заполнения")]
        [MaxLength(100)]
        public required string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public ICollection<WeeksTraining> Weeks { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
