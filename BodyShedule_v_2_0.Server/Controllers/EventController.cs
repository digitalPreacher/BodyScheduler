using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Globalization;

namespace BodyShedule_v_2_0.Server.Controllers
{
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
        [Route("GetEvents/{userLogin}")]
        public async Task<IActionResult> GetEventsAsync(string userLogin)
        {
            try
            {
                if (userLogin != null)
                {
                    var events = await _service.GetEventsAsync(userLogin);

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
    }
}
