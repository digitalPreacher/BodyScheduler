using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class GetEventDTO
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset StartTime { get; set; }

        [Required]
        public DateTimeOffset EndTime { get; set; }
        [Required]
        public ExerciseDTO[] Exercises { get; set; }
    }
}
