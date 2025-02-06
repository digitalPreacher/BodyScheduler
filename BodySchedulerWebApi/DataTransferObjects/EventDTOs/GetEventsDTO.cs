namespace BodySchedulerWebApi.DataTransferObjects.EventDTOs
{
    public class GetEventsDTO
    {
        public string Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public DateTimeOffset? Start { get; set; }
        public string? Status { get; set; }

    }
}
