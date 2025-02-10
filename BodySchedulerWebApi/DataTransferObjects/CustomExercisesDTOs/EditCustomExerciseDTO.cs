namespace BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs
{
    public class EditCustomExerciseDTO
    {
        public required string UserId { get; set; }
        public required int ExerciseId { get; set; }
        public required string ExerciseTitle { get; set; }
        public string? ExerciseDescription { get; set; }
        public IFormFile? Image { get; set; }
    }
}
