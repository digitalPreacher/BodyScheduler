using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodyShedule_v_2_0.Server.Models
{
    public class Exercise
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Поле Title обязательно для заполнения")]
        [MaxLength(100)]
        public required string Title { get; set; }
        public int QuantityApproaches { get; set; }
        public int QuantityRepetions { get; set; }
        public float Weight { get; set; }
        public int EventId { get; internal set; }
        public DateTime CreateAt { get; set; } = DateTime.Now.ToUniversalTime();
        public virtual Event? Event { get; set; }
        public virtual ApplicationUser? User { get; set; }

    }
}
