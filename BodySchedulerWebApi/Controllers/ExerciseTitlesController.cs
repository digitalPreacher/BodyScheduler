using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodySchedulerWebApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseTitlesController : ControllerBase
    {
        private readonly IExportExerciseTitlesService _service;
        private readonly ILogger<ExerciseTitlesController> _logger;

        public ExerciseTitlesController(IExportExerciseTitlesService service, ILogger<ExerciseTitlesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //get all titles for exercise fields to event and training program forms
        [HttpGet]
        [Route("GetExerciseTitles/{userId}")]
        public async Task<IActionResult> GetExerciseTitlesAsync([FromRoute]string userId)
        {
            try
            {
                var exerciseTitlesList = await _service.GetExerciseTitlesAsync(userId);
                return Ok(exerciseTitlesList);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}

