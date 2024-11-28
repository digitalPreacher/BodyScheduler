using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodyShedule_v_2_0.Server.Models
{
    public class BodyMeasure
    {
        [Key]
        public int Id { get; set; }

        public required string MuscleName { get; set; }

        public float MuscleSize { get; set; }

        public DateTime CreateAt { get; set; }

        public required virtual ApplicationUser User { get; set; }

    }
}
