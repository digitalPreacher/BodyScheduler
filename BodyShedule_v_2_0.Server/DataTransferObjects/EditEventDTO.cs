using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class EditEventDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public List<ExerciseDTO> Exercises { get; set; }
        public string UserId { get; set; }  

    }
}
