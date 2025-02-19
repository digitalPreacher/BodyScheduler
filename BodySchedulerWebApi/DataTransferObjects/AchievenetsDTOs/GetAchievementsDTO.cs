namespace BodySchedulerWebApi.DataTransferObjects.AchievenetsDTOs
{
    public class GetAchievementsDTO
    {
        public int Id { get; set; }
        public string Name {  get; set; } 
        public int CurrentCountValue { get; set; }
        public int PurposeValue { get; set; }
        public bool IsCompleted { get; set; }
        public string Description { get; set; }
    }
}
