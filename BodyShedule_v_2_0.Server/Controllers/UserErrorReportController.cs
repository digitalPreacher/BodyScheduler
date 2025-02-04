using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserErrorReportController : ControllerBase
    {
        private readonly IUserErrorReportService _service;
        private readonly ILogger<UserErrorReportController> _logger;

        public UserErrorReportController(IUserErrorReportService service, ILogger<UserErrorReportController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        [Route("UserErrorReport")]
        public async Task<IActionResult> UserErrorReport([FromBody]UserErrorReportDTO reportInfo)
        {
            try
            {
                var result = await _service.UserErrorReportAsync(reportInfo);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при добавлении записи в БД" });
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка. Повторите попытку чуть позже" });
            }
        }

    }
}
