using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects.BodyMeasureDTOs
{
    public class GetUniqueBodyMeasureDTO
    {
        public string MuscleName { get; set; }
        public float MusclesSize { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
