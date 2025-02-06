namespace BodySchedulerWebApi.DataTransferObjects.EventDTOs
{
    public class GetTrainingResults
    {
        public int Id { get; set; }
        public string TrainingTime { get; set; }
        public float? AmountWeight { get; set; }
        public DateTimeOffset CreateAt { get; set; }
        public int EventId { get; set; }
    }
}
