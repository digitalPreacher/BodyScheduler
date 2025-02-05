using BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs;
using BodyShedule_v_2_0.Server.Exceptions;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingProgramController : ControllerBase
    {
        private readonly ITrainingProgramService _service;
        private readonly ILogger<TrainingProgramController> _logger;

        public TrainingProgramController(ITrainingProgramService service, ILogger<TrainingProgramController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //add new training program
        [HttpPost]
        [Route("AddTrainingProgram")]
        public async Task<IActionResult> AddTrainingProgramAsync([FromBody]AddTrainingProgramDTO trainingProgramInfo)
        {
            try
            {
                await _service.AddTrainingProgramAsync(trainingProgramInfo);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при добавлении записи в БД" });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //get all user training program
        [HttpGet]
        [Route("GetTrainingPrograms/{userId}")]
        public async Task<IActionResult> GetTrainingProgramsAsync([FromRoute]string userId)
        {
            try
            {
                var programs = await _service.GetTrainingProgramsAsync(userId);
                return Ok(programs);
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //get user training program
        [HttpGet]
        [Route("GetTrainingProgram/{trainingProgramId}")]
        public async Task<IActionResult> GetTrainingProgramAsync([FromRoute]int trainingProgramId)
        {
            try
            {
                var program = await _service.GetTrainingProgramAsync(trainingProgramId);
                return Ok(program);
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //delete training program
        [HttpDelete]
        [Route("DeleteTrainingProgram/{trainingProgramId}")]
        public async Task<IActionResult> DeleteTrainingProgramAsync([FromRoute]int trainingProgramId)
        {
            try
            {
                var result = await _service.DeleteTrainingProgramAsync(trainingProgramId);
                return Ok(new { Message = $"Запись с id: {trainingProgramId} успешно удалена" });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при добавлении записи в БД" });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //edit training program
        [HttpPut]
        [Route("EditTrainingProgram")]
        public async Task<IActionResult> EditTrainingProgramAsync([FromBody]EditTrainingProgramDTO trainingProgramInfo)
        {
            try
            {
                var result = await _service.EditTrainingProgramAsync(trainingProgramInfo);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при добавлении записи в БД" });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}
