using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;

namespace BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs
{
    public class GetWeeksTrainingDTO
    {
        public int Id { get; set; }
        public int WeekNumber { get; set; }
        public List<GetEventDTO> Events { get; set; }
    }
}
