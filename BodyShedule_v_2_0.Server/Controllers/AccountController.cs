using BodyShedule_v_2_0.Server.DataTransferObjects.AccountDTOs;
using BodyShedule_v_2_0.Server.Exceptions;
using BodyShedule_v_2_0.Server.Helpers;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IEmailSenderService _emailSenderService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IAccountService accountService, ILogger<AccountController> logger, IEmailSenderService emailSenderService)
        {
            _accountService = accountService;
            _logger = logger;
            _emailSenderService = emailSenderService;
        }

        //Method for registered new users
        [AllowAnonymous]
        [HttpPost]
        [Route("UserSignUp")]
        public async Task<IActionResult> UserSignUpAsync([FromBody] UserRegistationDTO userRegistrationData)
        {
            try
            {
                var result = await _accountService.SignUpAsync(userRegistrationData);
                if (result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest(new { ErrorArray = result.Errors } );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //Log in method
        [AllowAnonymous]
        [HttpPost]
        [Route("UserSignIn")]
        public async Task<IActionResult> UserSignInAsync([FromBody] UserLoginDTO userCredentials)
        {
            try
            {
                var result = await _accountService.SignInAsync(userCredentials);
                if (result.Succeeded)
                {
                    var userRoles = await _accountService.GetUserRolesAsync(userCredentials);
                    var userId = await _accountService.GetUserIdAsync(userCredentials.Login);
                    var tokenString = JWTHelper.GenerateToken(userCredentials, userRoles[0], userId);

                    return Ok(new { token = tokenString });
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch(EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //change current user password
        [Authorize]
        [HttpPost]
        [Route("ChangePassword")]
        public async Task<ActionResult> ChangeUserPasswordAsync([FromBody]ChangeUserPasswordDTO changePasswordInfo)
        {
            try
            {
                var result = await _accountService.ChangeUserPasswordAsync(changePasswordInfo);
                if(result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest(new {ErrorArray = result.Errors});
                }
            }
            catch (DbUpdateException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(new { Message = "Произошла ошибка при изменении записи в БД"});
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //forgot user password
        [AllowAnonymous]
        [HttpPost]
        [Route("ForgotPassword")]
        public async Task<IActionResult> ForgotUserPasswordAsync([FromBody]ForgotPasswordDTO forgotPasswordInfo)
        {
            try
            {
                var token = await _accountService.GenerateTokenAsync(forgotPasswordInfo.Email);
                var domainName = Environment.GetEnvironmentVariable("DOMAIN_NAME");
                if (string.IsNullOrEmpty(domainName))
                {
                    throw new ArgumentException("Не заполнено доменное имя");
                }

                var link = AbsoluteUrlGenerateHelper.GenerateAbsoluteUrl("reset-password", "account", token, domainName, forgotPasswordInfo.Email);
                
                await _emailSenderService.SendEmailPasswordResetAsync(forgotPasswordInfo.Email, link);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest("Не заполнены обязательные параметры на стороне сервера для отправки email. Пожалуйста, обратитесь в техническую поддержку");
            }
            catch (EmailSendException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest("Возникла ошибка при отправке сведений на Ваш email. Пожалуйста, обратитесь в техническую поддержку");
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //reset user password if forgot it
        [AllowAnonymous]
        [HttpPost]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetUserPasswordAsync([FromBody]ResetUserPasswordDTO resetPasswordInfo)
        {
            try
            {
                var result = await _accountService.ResetUserPasswordAsync(resetPasswordInfo);
                if(result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest(new { ErrorArray = result.Errors });
                }
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}
