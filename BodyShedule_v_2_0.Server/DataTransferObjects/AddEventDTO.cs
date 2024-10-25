using BodyShedule_v_2_0.Server.Models;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class AddEventDTO
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset StartTime { get; set; } 
        [Required]
        public List<ExerciseDTO> Exercises { get; set; }
    }
}
