﻿namespace BodySchedulerWebApi.DataTransferObjects.EventDTOs
{
    public class ExerciseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int QuantityApproaches { get; set; }
        public int QuantityRepetions { get; set; }
        public float Weight { get; set; }
    }
}
