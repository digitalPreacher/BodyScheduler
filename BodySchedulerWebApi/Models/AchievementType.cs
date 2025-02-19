using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class AchievementType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
