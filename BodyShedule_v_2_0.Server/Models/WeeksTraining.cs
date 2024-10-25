using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodyShedule_v_2_0.Server.Models
{
    public class WeeksTraining
    {
        [Key]
        public int Id { get; set; }
        public required int WeekNumber { get; set; }
        [ForeignKey("Program")]
        public int ProgramId { get; set; }
        public virtual TrainingProgram Program { get; set; }

        public virtual List<Event> Events { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
