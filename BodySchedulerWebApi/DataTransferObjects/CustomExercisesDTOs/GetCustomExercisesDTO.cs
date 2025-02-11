namespace BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs
{
    public class GetCustomExercisesDTO
    {
        public required int ExerciseId { get; set; }
        public required string ExerciseTitle { get; set; }
        public string? Type { get; set; }
        public string? ExerciseDescription { get; set; }
        public string? ImageName { get; set; }
        public byte[]? Image { get; set; }
    }
}
