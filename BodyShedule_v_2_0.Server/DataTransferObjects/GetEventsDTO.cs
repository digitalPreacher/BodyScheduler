using BodyShedule_v_2_0.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace BodyShedule_v_2_0.Server.DataTransferObjects
{
    public class GetEventsDTO
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset Start{ get; set; }

    }
}
