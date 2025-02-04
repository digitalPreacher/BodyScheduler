﻿using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Exceptions;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingResultController : ControllerBase
    {
        private readonly ITrainingResultService _service;
        private readonly ILogger<TrainingResultController> _logger;

        public TrainingResultController(ITrainingResultService service, ILogger<TrainingResultController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //Add user training result
        [HttpPost]
        [Route("AddTrainingResult")]
        public async Task<IActionResult> AddTrainingResultAsync([FromBody]TrainingResultDto trainingResultInfo)
        {
            try
            {
                var result = await _service.AddTrainingResultAsync(trainingResultInfo);
                return Ok();
            }
            catch(DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при добавлении записи в БД" });
            }
            catch(EntityNotFoundException ex)
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
