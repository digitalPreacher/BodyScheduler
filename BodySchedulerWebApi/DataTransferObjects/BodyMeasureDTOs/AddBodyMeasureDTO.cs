namespace BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs
{
    public class AddBodyMeasureDTO
    {
        public string UserId { get; set; }
        public List<BodyMeasureDTO> BodyMeasureSet { get; set; }
    }
}
