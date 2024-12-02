using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;

namespace BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs
{
    public class WeeksTrainingDTO
    {
        public required int WeekNumber { get; set; }
        public List<AddEventDTO> Events { get; set; }
    }
}
