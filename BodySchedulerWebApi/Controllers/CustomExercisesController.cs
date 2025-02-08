using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Mvc;

namespace BodySchedulerWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomExercisesController : ControllerBase
    {
        private readonly ICustomExercisesService _service;
        private readonly ILogger<CustomExercisesController> _logger;

        public CustomExercisesController(ICustomExercisesService service, ILogger<CustomExercisesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        [Route("AddCustomExercises")]
        public async Task<IActionResult> AddCustomExercisesAsync([FromForm]AddCustomExerciseDTO exerciseInfo)
        {
            try
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };

                if(exerciseInfo.Image != null)
                {
                    var extension = Path.GetExtension(exerciseInfo.Image.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(extension))
                    {
                        return BadRequest("Некорректный тип файла");
                    }

                }

                await _service.AddCustomExercisesAsync(exerciseInfo);
                return Ok();
            }
            catch(EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
