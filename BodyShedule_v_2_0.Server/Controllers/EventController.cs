using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
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
        [Route("GetEvents/{userId}/{status}")]
        public async Task<IActionResult> GetEventsAsync(string userId, string status)
        {
            try
            {
                var events = await _service.GetEventsAsync(userId, status);
                return Ok(events);
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

        //Adding user event
        [HttpPost]
        [Route("AddEvent")]
        public async Task<IActionResult> AddEventAsync([FromBody] AddEventDTO eventInfo)
        {
            try
            {
                await _service.AddEventAsync(eventInfo);
                return Ok(new { Message = "Запись успешно добавлена" });
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

        //Editing user event
        [HttpPut]
        [Route("EditEvent")]
        public async Task<IActionResult> EditEventAsync([FromBody] EditEventDTO eventInfo)
        {
            try
            {
                await _service.EditEventAsync(eventInfo);
                return Ok(new { Message = "Запись успешно отредактирована" });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при изменении записи в БД" });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //Removing user event
        [HttpGet]
        [Route("GetEvent/{id}")]
        public async Task<IActionResult> GetEventAsync(int id)
        {
            try
            {
                var getEvent = await _service.GetEventAsync(id);
                return Ok(getEvent);
               
            }
            catch(EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //Delete user event
        [HttpDelete]
        [Route("DeleteEvent/{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                await _service.DeleteEventAsync(id);
                return Ok(new { Message = $"Запись с id: {id} успешно удалена" });

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

        //Change status for user event
        [HttpPut]
        [Route("ChangeEventStatus")]
        public async Task<IActionResult> ChangeEventStatusAsync(ChangeEventStatusDTO eventStatusInfo)
        {
            try
            {
                await _service.ChangeEventStatusAsync(eventStatusInfo);
                return Ok();
 
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при изменении записи в БД" });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}
