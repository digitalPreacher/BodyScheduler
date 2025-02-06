using BodySchedulerWebApi.DataTransferObjects.EventDTOs;

namespace BodySchedulerWebApi.DataTransferObjects.TrainingProgramDTOs
{
    public class GetWeeksTrainingDTO
    {
        public int Id { get; set; }
        public int WeekNumber { get; set; }
        public List<GetEventDTO>? Events { get; set; }
    }
}
