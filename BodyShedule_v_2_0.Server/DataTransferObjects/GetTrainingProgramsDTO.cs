﻿using BodyShedule_v_2_0.Server.Models;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class GetTrainingProgramsDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
