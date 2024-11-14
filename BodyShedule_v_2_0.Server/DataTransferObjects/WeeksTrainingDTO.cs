namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class WeeksTrainingDTO
    {
        public required int WeekNumber { get; set; }
        public List<AddEventDTO> Events { get; set; }
    }
}
