using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodyShedule_v_2_0.Server.Models
{
    public class Exercise
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int QuantityApproaches { get; set; }
        public int QuantityRepetions { get; set; }
        public int? EventId { get; internal set; }
        public DateTime CreateAt { get; set; } = DateTime.Now.ToUniversalTime();
        public int? WeeksTrainingId { get; set; }
        public virtual WeeksTraining? WeeksTraining { get; set; }
        public virtual Event? Event { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
