namespace BodySchedulerWebApi.DataTransferObjects.EventDTOs
{
    public class AddEventDTO
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTimeOffset StartTime { get; set; }
        public List<ExerciseDTO> Exercises { get; set; }
    }
}
