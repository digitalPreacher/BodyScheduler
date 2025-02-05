namespace BodyShedule_v_2_0.Server.DataTransferObjects.BodyMeasureDTOs
{
    public class GetBodyMeasuresToLineChartDTO
    {
        public string Name { get; set; }
        public List<MusclesSizeToLineChartDTO> Series { get; set; }
    }
}
