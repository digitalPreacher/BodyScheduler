using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrainingProgramController : ControllerBase
    {
        private readonly ITrainingProgramService _service;
        private readonly ILogger<TrainingProgramController> _logger;

        public TrainingProgramController(ITrainingProgramService service, ILogger<TrainingProgramController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        [Route("AddTrainingProgram")]
        public async Task<IActionResult> AddTrainingProgramAsync(AddTrainingProgramDTO trainingProgramInfo)
        {
            var result = await _service.AddTrainingProgramAsync(trainingProgramInfo);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
