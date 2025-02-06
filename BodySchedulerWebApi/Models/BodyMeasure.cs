using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodySchedulerWebApi.Models
{
    public class BodyMeasure
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public required string MuscleName { get; set; }

        public float MuscleSize { get; set; }

        public DateTimeOffset CreateAt { get; set; }

        public string DateToLineChart { get; set; }

        public required virtual ApplicationUser User { get; set; }

    }
}
