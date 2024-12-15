using BodyShedule_v_2_0.Server.DataTransferObjects.AccountDTOs;
using BodyShedule_v_2_0.Server.Helpers;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IAccountService accountService, ILogger<AccountController> logger)
        {
            _accountService = accountService;
            _logger = logger;
        }

        //Method for registered new users
        [AllowAnonymous]
        [HttpPost]
        [Route("UserSignUp")]
        public async Task<IActionResult> UserSignUp([FromBody] UserRegistationDTO userRegistrationData)
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
                    return BadRequest(new { message = result.Errors.Select(x => x.Description) });
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error: {Message}", ex.Message);

                return BadRequest(new InvalidOperationException("Произошла неизвестная ошибка"));
            }
        }

        //Log in method
        [AllowAnonymous]
        [HttpPost]
        [Route("UserSignIn")]
        public async Task<IActionResult> UserSignIn([FromBody] UserLoginDTO userCredentials)
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
            catch (Exception ex)
            {
                _logger.LogInformation("Error: {Message}", ex.Message);

                return BadRequest(new InvalidOperationException("Произошла неизвестная ошибка"));
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
                    return Unauthorized( new { Message = "Введен некорректный пароль пользователя"});
                }

            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);  
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
                var result = await _accountService.ForgotUserPasswordAsync(forgotPasswordInfo.Email);

                return Ok();
            }
            catch(Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
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
                return BadRequest(ex.Message);
            }
        }
    }
}
