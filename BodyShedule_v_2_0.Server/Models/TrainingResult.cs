using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.Models
{
    public class TrainingResult
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Поле TrainingTime обязательно для заполнения")]
        public required string TrainingTime { get; set; }
        public float? AmountWeight { get; set; }
        public DateTimeOffset CreateAt { get; set; }
        public required virtual ApplicationUser User { get; set; }
        public required virtual Event Event { get; set; }

    }
}
