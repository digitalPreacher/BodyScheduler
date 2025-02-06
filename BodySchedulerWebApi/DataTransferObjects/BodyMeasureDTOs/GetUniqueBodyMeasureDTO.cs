namespace BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs
{
    public class GetUniqueBodyMeasureDTO
    {
        public string MuscleName { get; set; }
        public float MusclesSize { get; set; }
        public DateTimeOffset CreateAt { get; set; }
    }
}
