namespace BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs
{
    public class GetCustomExerciseTitleDTO
    {
        public byte[]? Image { get; set; }
        public required string Title { get; set; }   
    }
}
