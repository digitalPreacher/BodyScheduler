namespace BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs
{
    public class GetBodyMeasuresToLineChartDTO
    {
        public string Name { get; set; }
        public List<MusclesSizeToLineChartDTO> Series { get; set; }
    }
}
