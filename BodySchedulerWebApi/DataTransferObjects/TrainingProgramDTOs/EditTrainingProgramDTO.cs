namespace BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs
{
    public class EditTrainingProgramDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public List<GetWeeksTrainingDTO> Weeks { get; set; }
    }
}
