using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.Models
{
    public class ExerciseTitle
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
    }
}
