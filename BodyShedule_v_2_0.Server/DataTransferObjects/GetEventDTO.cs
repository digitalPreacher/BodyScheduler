using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class GetEventDTO
    {
        //[Required]
        //public string Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        //[Required]
        //public DateTimeOffset Start { get; set; }

        //[Required]
        //public DateTimeOffset End { get; set; }
    }
}
