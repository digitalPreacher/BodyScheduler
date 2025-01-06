using BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            var result = await _service.AddTrainingProgramAsync(trainingProgramInfo);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        //get all user training program
        [HttpGet]
        [Route("GetTrainingPrograms/{userId}")]
        public async Task<IActionResult> GetTrainingProgramsAsync(string userId)
        {
            try
            {
                if (userId != null) {
                    var programs = await _service.GetTrainingProgramsAsync(userId);
                    return Ok(programs);
                }
                else
                {
                    return BadRequest(new { Message = "Параметр запроса не должен быть пустым" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //get user training program
        [HttpGet]
        [Route("GetTrainingProgram/{trainingProgramId}")]
        public async Task<IActionResult> GetTrainingProgramAsync(int trainingProgramId)
        {
            try
            {
                var programs = await _service.GetTrainingProgramAsync(trainingProgramId);
                return Ok(programs);
            }
            catch(Exception ex) 
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //delete training program
        [HttpDelete]
        [Route("DeleteTrainingProgram/{trainingProgramId}")]
        public async Task<IActionResult> DeleteTrainingProgramAsync(int trainingProgramId)
        {
            try
            {
                var result = await _service.DeleteTrainingProgramAsync(trainingProgramId);
                if (result)
                {
                    return Ok(new { Message = $"Запись с id: {trainingProgramId} успешно удалена" });
                }
                else
                {
                    return BadRequest(new { Message = $"Запись с id: {trainingProgramId} не найдена" });
                }
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //edit training program
        [HttpPut]
        [Route("EditTrainingProgram")]
        public async Task<IActionResult> EditTrainingProgramAsync([FromBody]EditTrainingProgramDTO trainingProgramInfo)
        {
            var result = await _service.EditTrainingProgramAsync(trainingProgramInfo);
            if (result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
