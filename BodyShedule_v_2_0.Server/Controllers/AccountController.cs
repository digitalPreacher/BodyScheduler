using BodyShedule_v_2_0.Server.DataTransferObjects;
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
                {   foreach (var error in result.Errors)
                    {
                        _logger.LogInformation("Error: {Message}", error.Description);
                    }
                    return BadRequest(result.Errors);
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
                    var tokenString = JWTHelper.GenerateToken(userCredentials, userRoles[0]);

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
    }
}
