using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Mvc;

namespace BodySchedulerWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserExperienceController : ControllerBase
    {
        private readonly IUserExperienceService _userExperienceService;
        private readonly ILogger<UserExperienceController> _logger;

        public UserExperienceController(IUserExperienceService userExperienceService, ILogger<UserExperienceController> logger)
        {
            _userExperienceService = userExperienceService;
            _logger = logger;
        }

        [HttpPut]
        [Route("CalculateUserExperience/userId={userId}")]
        public async Task<IActionResult> CalculateUserExperienceAsync(string userId)
        {
            try
            {
                await _userExperienceService.CalculateUserExperienceAsync(userId);
                return Ok();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}
