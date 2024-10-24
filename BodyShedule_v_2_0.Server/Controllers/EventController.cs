﻿using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BodyShedule_v_2_0.Server.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _service;
        private readonly ILogger<EventController> _logger;

        public EventController(IEventService service, ILogger<EventController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //Get all user events
        [HttpGet]
        [Route("GetEvents/{userId}")]
        public async Task<IActionResult> GetEventsAsync(string userId)
        {
            try
            {
                if (userId != null)
                {
                    var events = await _service.GetEventsAsync(userId);

                    return Ok(events);
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

        //Adding user event
        [HttpPost]
        [Route("AddEvent")]
        public async Task<IActionResult> AddEvent([FromBody] AddEventDTO eventInfo)
        {
            try
            {
                var result = await _service.AddEventAsync(eventInfo);
                if (result)
                {
                    return Ok(new { Message = "Запись успешно добавлена" });
                }
                else
                {
                    return BadRequest(new { Message = "Произошла ошибка, повторите запрос" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }

        }

        //Editing user event
        [HttpPut]
        [Route("EditEvent")]
        public async Task<IActionResult> EditEvent([FromBody] EditEventDTO eventInfo)
        {
            try
            {
                var result = await _service.EditEventAsync(eventInfo);
                if (result)
                {
                    return Ok(new { Message = "Запись успешно отредактирована " });
                }
                else
                {
                    return BadRequest(new { Message = "Произошла ошибка, повторите запрос" });
                }
            }
            catch (Exception ex)
            { 
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //Removing user event
        [HttpGet]
        [Route("GetEvent/{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            try
            {
                var getEvent = await _service.GetEventAsync(id);
                if(getEvent != null)
                {
                    return Ok(getEvent);
                }
                else
                {
                    return NotFound(new { Message = $"Запись с id: {id} не найдена" });
                }

            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);  
            }
        }

        [HttpDelete]
        [Route("DeleteEvent/{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                var result = await _service.DeleteEventAsync(id);
                if (result)
                {
                    return Ok(new { Message = $"Запись с id: {id} успешно удалена" });
                }
                else
                {
                    return NotFound(new { Message = $"Запись с id: {id} не найдена" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
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
