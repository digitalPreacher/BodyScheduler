namespace BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs
{
    public class MusclesSizeToLineChartDTO
    {
        public float Value { get; set; }
        public string Name { get; set; }

        public DateTimeOffset CreateAt { get; set; }
    }
}
