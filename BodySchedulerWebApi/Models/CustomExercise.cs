using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class CustomExercise
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(1000)]
        public required string ExerciseTitle { get; set; }
        [MaxLength(2000)]
        public string? ExerciseDescription { get; set; }
        [MaxLength(1000)]
        public string? Path { get; set; }
        [MaxLength(100)]
        public string? Type { get; set; }
        public DateTime CreateAt { get; set; }
        public required ApplicationUser User { get; set; }
    }
}
