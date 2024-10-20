using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class EditEventDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset StartTime { get; set; } = DateTimeOffset.Now;

        [Required]
        public DateTimeOffset EndTime { get; set; } = DateTimeOffset.Now;

        public List<ExerciseDTO> Exercises { get; set; }

        [Required]
        public string UserId { get; set; }  

    }
}
