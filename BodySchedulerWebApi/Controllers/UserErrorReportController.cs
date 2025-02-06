using BodySchedulerWebApi.DataTransferObjects.UserErrorReportDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodySchedulerWebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserErrorReportController : ControllerBase
    {
        private readonly IUserErrorReportService _service;
        private readonly IEmailSenderService _emailSenderService;
        private readonly ILogger<UserErrorReportController> _logger;

        public UserErrorReportController(IUserErrorReportService service, ILogger<UserErrorReportController> logger, IEmailSenderService emailSenderService)
        {
            _service = service;
            _logger = logger;
            _emailSenderService = emailSenderService;
        }

        //Add data from user error report
        [HttpPost]
        [Route("UserErrorReport")]
        public async Task<IActionResult> UserErrorReport([FromBody]UserErrorReportDTO reportInfo)
        {
            try
            {
                await _service.AddUserErrorReportAsync(reportInfo);
                await _emailSenderService.SendEmailUserFeedbackAsync(reportInfo.Email, reportInfo.Description);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при добавлении записи в БД" });
            }
            catch(ArgumentException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Не заполнены обязательные параметры на стороне сервера. Пожалуйста, обратитесь в техническую поддержку" });
            }
            catch (EmailSendException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Возникла ошибка при отправке сообщения о сбое. Повторите попытку чуть позже" });
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка. Повторите попытку чуть позже" });
            }
        }

    }
}
