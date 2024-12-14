namespace BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs
{
    public class GetEventDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Status { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public List<ExerciseDTO> Exercises { get; set; }
    }
}
