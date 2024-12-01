namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class GetBodyMeasuresToLineChartDTO
    {
        public string Name { get; set; }
        public MusclesSizeToLineChartDTO[] Series {get;set;}
    }
}
