using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class ExerciseTitle
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Поле Title обязательно для заполнения")]
        [MaxLength(100)]
        public required string Title { get; set; }
    }
}
