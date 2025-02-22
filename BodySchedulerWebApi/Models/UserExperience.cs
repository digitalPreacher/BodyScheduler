using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class UserExperience
    {
        [Key]
        public int Id { get; set; } 
        public int CurrentExperienceValue {  get; set; }
        public int GoalExperienceValue { get; set; }
        public DateTime CreateAt { get; set; }  
        public DateTime ModTime { get; set; }   
        public required ApplicationUser User { get; set; }
    }
}
