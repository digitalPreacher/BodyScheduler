using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodySchedulerWebApi.Models
{
    public class WeeksTraining
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Поле WeekNumber обязательно для заполнения")]
        public required int WeekNumber { get; set; }

        [ForeignKey("Program")]
        public int ProgramId { get; set; }
        public virtual TrainingProgram Program { get; set; }
        public virtual List<Event> Events { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
