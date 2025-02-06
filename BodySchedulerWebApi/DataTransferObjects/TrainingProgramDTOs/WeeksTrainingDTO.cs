using BodySchedulerWebApi.DataTransferObjects.EventDTOs;

namespace BodySchedulerWebApi.DataTransferObjects.TrainingProgramDTOs
{
    public class WeeksTrainingDTO
    {
        public required int WeekNumber { get; set; }
        public List<AddEventDTO> Events { get; set; }
    }
}
