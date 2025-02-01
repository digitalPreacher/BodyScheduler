namespace BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs
{
    public class TrainingResultDto
    {
        public required int EventId { get; set; }
        public required string UserId { get; set; }
        public required string TrainingTime { get; set; }
        public float? AmountWeight { get; set; }
    }
}
