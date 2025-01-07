using BodyShedule_v_2_0.Server.DataTransferObjects.UserErrorReportDTOs;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Controllers
{
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
        public IActionResult UserErrorReport([FromBody]UserErrorReportDTO reportInfo)
        {
            try
            {
                var result = _service.UserErrorReport(reportInfo);
                if (result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка. Повторите попытку чуть позже" });
            }
        }

    }
}
