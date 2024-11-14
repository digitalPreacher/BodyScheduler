namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class GetWeeksTrainingDTO
    {
        public int Id { get; set; }
        public int WeekNumber { get; set; }
        public List<GetEventDTO> Events { get; set; }
    }
}
