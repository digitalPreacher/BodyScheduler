namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class AddBodyMeasureDTO
    {
        public string UserId { get; set; }  
        public List<BodyMeasureDTO> BodyMeasureSet { get; set; }
    }
}
