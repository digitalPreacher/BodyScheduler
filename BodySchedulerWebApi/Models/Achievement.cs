using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class Achievement
    {
        [Key]
        public int Id { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime ModTime { get; set; }
        public int CurrentCountValue { get; set; }
        public int PurposeValue { get; set; }
        public bool IsCompleted { get; set; }
        public required AchievementType Type { get; set; }
        public required ApplicationUser User { get; set; }
    }
}
