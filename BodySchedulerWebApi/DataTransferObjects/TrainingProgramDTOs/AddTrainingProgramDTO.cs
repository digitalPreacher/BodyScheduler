﻿namespace BodySchedulerWebApi.DataTransferObjects.TrainingProgramDTOs
{
    public class AddTrainingProgramDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public List<WeeksTrainingDTO> Weeks { get; set; }
    }
}
